import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { DeleteAccountDto } from './dto/delete-account.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    if (!email) return null;
    return this.prisma.user.findFirst({
      where: {
        email: {
          equals: email.trim(),
          mode: 'insensitive'
        }
      }
    });
  }

  async create(data: any): Promise<User> {
    return this.prisma.user.create({
      data: {
        ...data,
        email: data.email ? data.email.trim().toLowerCase() : data.email
      }
    });
  }

  private isValidUuid(val?: string): boolean {
    return typeof val === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(val);
  }

  async getProfile(userId: string) {
    if (!this.isValidUuid(userId)) {
      throw new UnauthorizedException('Invalid user identity');
    }

    let user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        createdAt: true,
      }
    });
    if (!user) throw new NotFoundException('User not found');

    // If phone is missing on user profile, check if user has an address with a phone number (e.g. from an order)
    if (!user.phone) {
      try {
        const addrWithPhone = await this.prisma.address.findFirst({
          where: { userId },
          orderBy: { createdAt: 'desc' },
        });
        if (addrWithPhone?.phone) {
          user = await this.prisma.user.update({
            where: { id: userId },
            data: { phone: addrWithPhone.phone },
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phone: true,
              role: true,
              createdAt: true,
            }
          });
        }
      } catch {
        // Silently continue with existing user profile
      }
    }

    return user;
  }

  async updateProfile(userId: string, data: { firstName?: string; lastName?: string; phone?: string }) {
    if (!this.isValidUuid(userId)) {
      throw new UnauthorizedException('Invalid user identity');
    }
    return this.prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        createdAt: true,
      }
    });
  }

  async changePassword(userId: string, data: any) {
    if (!this.isValidUuid(userId)) {
      throw new UnauthorizedException('Invalid user identity');
    }
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const isValid = await bcrypt.compare(data.currentPassword, user.passwordHash || '');
    if (!isValid) throw new BadRequestException('Invalid current password');

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash: hashedPassword,
        refreshToken: null, // Revoke all active sessions upon password change (V-08)
      },
    });

    return { message: 'Password updated successfully' };
  }

  async getAddresses(userId: string) {
    if (!this.isValidUuid(userId)) {
      return [];
    }

    const saved = await this.prisma.address.findMany({
      where: { userId, orders: { none: {} } },
      orderBy: { isDefault: 'desc' },
    });

    if (saved.length > 0) {
      return saved;
    }

    // Auto-recovery / fallback: If user placed an order but has 0 saved addresses,
    // promote the most recent order address to a saved address so they never lose their data
    try {
      const recentOrderAddress = await this.prisma.address.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });

      if (recentOrderAddress) {
        const alreadySaved = await this.prisma.address.findFirst({
          where: { userId, orders: { none: {} } },
        });
        if (alreadySaved) return [alreadySaved];

        const cloned = await this.prisma.address.create({
          data: {
            userId,
            fullName: recentOrderAddress.fullName,
            phone: recentOrderAddress.phone,
            addressLine1: recentOrderAddress.addressLine1,
            addressLine2: recentOrderAddress.addressLine2,
            city: recentOrderAddress.city,
            state: recentOrderAddress.state,
            postalCode: recentOrderAddress.postalCode,
            country: recentOrderAddress.country,
            isDefault: true,
          },
        });
        return [cloned];
      }
    } catch {
      // Fallback
    }

    return [];
  }

  async addAddress(userId: string, data: any) {
    const count = await this.prisma.address.count({ where: { userId, orders: { none: {} } } });
    const isDefault = count === 0 || data.isDefault;

    if (isDefault) {
      await this.prisma.address.updateMany({
        where: { userId, orders: { none: {} } },
        data: { isDefault: false },
      });
    }

    return this.prisma.address.create({
      data: {
        ...data,
        userId,
        isDefault,
      }
    });
  }

  async updateAddress(userId: string, addressId: string, data: any) {
    const address = await this.prisma.address.findFirst({ where: { id: addressId, userId, orders: { none: {} } } });
    if (!address) throw new NotFoundException('Address not found');

    if (data.isDefault) {
      await this.prisma.address.updateMany({
        where: { userId, orders: { none: {} } },
        data: { isDefault: false },
      });
    }

    return this.prisma.address.update({
      where: { id: addressId },
      data,
    });
  }

  async setDefaultAddress(userId: string, addressId: string) {
    const address = await this.prisma.address.findFirst({ where: { id: addressId, userId, orders: { none: {} } } });
    if (!address) throw new NotFoundException('Address not found');

    await this.prisma.address.updateMany({
      where: { userId, orders: { none: {} } },
      data: { isDefault: false },
    });

    return this.prisma.address.update({
      where: { id: addressId },
      data: { isDefault: true },
    });
  }

  async deleteAddress(userId: string, addressId: string) {
    const address = await this.prisma.address.findFirst({ where: { id: addressId, userId, orders: { none: {} } } });
    if (!address) throw new NotFoundException('Address not found');

    await this.prisma.address.delete({ where: { id: addressId } });

    if (address.isDefault) {
      const nextAddress = await this.prisma.address.findFirst({ where: { userId, orders: { none: {} } } });
      if (nextAddress) {
        await this.prisma.address.update({
          where: { id: nextAddress.id },
          data: { isDefault: true },
        });
      }
    }

    return { message: 'Address deleted' };
  }

  private allUsersCache: { data: any; expiresAt: number } | null = null;
  private inFlightAllUsers: Promise<any> | null = null;
  private readonly ALL_USERS_TTL_MS = 15 * 1000;

  clearUsersCache() {
    this.allUsersCache = null;
    this.inFlightAllUsers = null;
  }

  async getAllUsers() {
    const now = Date.now();
    if (this.allUsersCache && now < this.allUsersCache.expiresAt) {
      return this.allUsersCache.data;
    }

    if (this.inFlightAllUsers) {
      return this.inFlightAllUsers;
    }

    this.inFlightAllUsers = (async () => {
      const users = await this.prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          role: true,
          status: true,
          emailVerified: true,
          createdAt: true,
          _count: {
            select: {
              orders: true,
            },
          },
        }
      });

      this.allUsersCache = {
        data: users,
        expiresAt: Date.now() + this.ALL_USERS_TTL_MS,
      };
      return users;
    })().finally(() => {
      this.inFlightAllUsers = null;
    });

    return this.inFlightAllUsers;
  }

  async deleteUserAdmin(id: string, adminUserId?: string) {
    if (adminUserId && id === adminUserId) {
      throw new BadRequestException('Cannot delete your own account');
    }
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    if (user.role === 'admin') {
      throw new BadRequestException('Cannot delete an admin account via customer management');
    }

    const orders = await this.prisma.order.findMany({ where: { userId: id }, select: { id: true } });
    const orderIds = orders.map(o => o.id);
    const carts = await this.prisma.cart.findMany({ where: { userId: id }, select: { id: true } });
    const cartIds = carts.map(c => c.id);

    await this.prisma.$transaction(async (tx) => {
      if (cartIds.length > 0) {
        await tx.cartItem.deleteMany({ where: { cartId: { in: cartIds } } });
        await tx.cart.deleteMany({ where: { id: { in: cartIds } } });
      }
      if (orderIds.length > 0) {
        await tx.payment.deleteMany({ where: { orderId: { in: orderIds } } });
        await tx.orderItem.deleteMany({ where: { orderId: { in: orderIds } } });
        await tx.order.deleteMany({ where: { id: { in: orderIds } } });
      }
      await tx.address.deleteMany({ where: { userId: id } });
      await tx.review.deleteMany({ where: { userId: id } });
      await tx.wishlist.deleteMany({ where: { userId: id } });
      await tx.notification.deleteMany({ where: { userId: id } });
      await tx.auditLog.deleteMany({ where: { userId: id } });
      await tx.adminAuditLog.deleteMany({ where: { adminId: id } });
      await tx.user.delete({ where: { id } });
    }, { timeout: 30000 });

    this.clearUsersCache();
    return { message: 'Customer deleted successfully' };
  }

  async getUserDetailAdmin(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        addresses: {
          where: { orders: { none: {} } },
          orderBy: { isDefault: 'desc' },
        },
        orders: {
          orderBy: { createdAt: 'desc' },
          include: {
            items: true
          }
        }
      }
    });

    if (!user) throw new NotFoundException('User not found');
    
    const totalOrders = user.orders.length;
    const lifetimeValue = user.orders
      .filter(o => o.paymentStatus === 'paid')
      .reduce((sum, order) => sum + Number(order.total), 0);
    const averageOrderValue = totalOrders > 0 ? lifetimeValue / totalOrders : 0;

    const {
      passwordHash: _passwordHash,
      refreshToken: _refreshToken,
      resetToken: _resetToken,
      resetTokenExpiry: _resetTokenExpiry,
      ...safeUser
    } = user;

    return {
      ...safeUser,
      metrics: {
        totalOrders,
        lifetimeValue,
        averageOrderValue,
      },
    };
  }

  async cleanupTestCustomers() {
    const PRESERVED_EMAILS = [
      'kulkarniabhay620@gmail.com',
      'kulkarniabhay920@gmail.com',
      'admin@rarenuts.com',
      'admin@auremont.com',
      'admin@example.com',
    ];

    const testUsers = await this.prisma.user.findMany({
      where: {
        role: { not: 'admin' },
        email: { notIn: PRESERVED_EMAILS },
        OR: [
          { email: { contains: 'test', mode: 'insensitive' } },
          { email: { contains: 'guest_', mode: 'insensitive' } },
          { email: { contains: 'buyer', mode: 'insensitive' } },
          { email: { contains: 'audit', mode: 'insensitive' } },
          { email: { contains: 'chaos', mode: 'insensitive' } },
          { email: { contains: 'stress', mode: 'insensitive' } },
          { email: { contains: 'idor', mode: 'insensitive' } },
          { email: { endsWith: '@guest.rarenuts.internal' } },
          { email: { endsWith: '@test.com' } },
          { email: { endsWith: '@rarenuts-test.com' } },
          { email: 'example@gmail.com' },
        ],
      },
      select: { id: true },
    });

    const testUserIds = testUsers.map((u) => u.id);
    if (testUserIds.length === 0) {
      return { message: 'No test customers found to clean up', deletedCount: 0 };
    }

    const testOrders = await this.prisma.order.findMany({
      where: { userId: { in: testUserIds } },
      select: { id: true },
    });
    const testOrderIds = testOrders.map((o) => o.id);

    const testCarts = await this.prisma.cart.findMany({
      where: { userId: { in: testUserIds } },
      select: { id: true },
    });
    const testCartIds = testCarts.map((c) => c.id);

    if (testOrderIds.length > 0) {
      await this.prisma.payment.deleteMany({ where: { orderId: { in: testOrderIds } } });
      await this.prisma.orderItem.deleteMany({ where: { orderId: { in: testOrderIds } } });
      await this.prisma.order.deleteMany({ where: { id: { in: testOrderIds } } });
    }

    if (testCartIds.length > 0) {
      await this.prisma.cartItem.deleteMany({ where: { cartId: { in: testCartIds } } });
      await this.prisma.cart.deleteMany({ where: { id: { in: testCartIds } } });
    }

    await this.prisma.wishlist.deleteMany({ where: { userId: { in: testUserIds } } });
    await this.prisma.review.deleteMany({ where: { userId: { in: testUserIds } } });
    await this.prisma.notification.deleteMany({ where: { userId: { in: testUserIds } } });
    await this.prisma.auditLog.deleteMany({ where: { userId: { in: testUserIds } } });
    await this.prisma.adminAuditLog.deleteMany({ where: { adminId: { in: testUserIds } } });
    await this.prisma.address.deleteMany({ where: { userId: { in: testUserIds } } });
    const delResult = await this.prisma.user.deleteMany({ where: { id: { in: testUserIds } } });

    this.clearUsersCache();
    return {
      message: `Successfully removed ${delResult.count} test customer(s)`,
      deletedCount: delResult.count,
    };
  }

  async deleteMyAccount(userId: string, dto: DeleteAccountDto) {
    if (!this.isValidUuid(userId)) {
      throw new UnauthorizedException('Invalid user identity');
    }

    if (!dto || !dto.confirmText || dto.confirmText.trim().toUpperCase() !== 'DELETE') {
      throw new BadRequestException('Please type "DELETE" to confirm permanent account deletion.');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.status === 'inactive' || user.email.startsWith('deleted_')) {
      throw new NotFoundException('Account not found or already deleted.');
    }

    if (user.role === 'admin') {
      throw new BadRequestException('Administrative accounts cannot be deleted through customer self-service.');
    }

    // Re-authentication check
    if (user.passwordHash) {
      if (!dto.password) {
        throw new BadRequestException('Your current password is required to verify account deletion.');
      }
      const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
      if (!isPasswordValid) {
        throw new BadRequestException('Incorrect password. Please verify your credentials and try again.');
      }
    }

    // Active order / financial operation check
    const activeOrders = await this.prisma.order.findMany({
      where: {
        userId,
        OR: [
          { orderStatus: { in: ['placed', 'confirmed', 'packed', 'shipped'] } },
          { paymentStatus: { in: ['pending', 'processing'] } },
        ],
      },
      select: { id: true, orderNumber: true, orderStatus: true, paymentStatus: true },
    });

    if (activeOrders.length > 0) {
      throw new BadRequestException(
        'You cannot delete your account while you have active orders or in-progress payments. Please wait until your orders are delivered or cancelled.',
      );
    }

    // Fetch all historical orders to determine if user row must be anonymized or hard-deleted
    const historicalOrders = await this.prisma.order.findMany({
      where: { userId },
      select: { id: true, addressId: true },
    });

    const userCarts = await this.prisma.cart.findMany({
      where: { userId },
      select: { id: true },
    });
    const userCartIds = userCarts.map((c) => c.id);

    await this.prisma.$transaction(
      async (tx) => {
        // 1. Purge active carts & cart items
        if (userCartIds.length > 0) {
          await tx.cartItem.deleteMany({ where: { cartId: { in: userCartIds } } });
          await tx.cart.deleteMany({ where: { id: { in: userCartIds } } });
        }
        await tx.cart.deleteMany({ where: { userId } });

        // 2. Purge personal wishlists, notifications, and standalone addresses
        await tx.wishlist.deleteMany({ where: { userId } });
        await tx.notification.deleteMany({ where: { userId } });
        // 3. Disassociate user reference in audit logs
        await tx.auditLog.updateMany({
          where: { userId },
          data: { userId: null },
        });

        if (historicalOrders.length === 0) {
          // No financial history exists: Full permanent deletion of addresses, reviews, and user
          await tx.address.deleteMany({ where: { userId } });
          await tx.review.deleteMany({ where: { userId } });
          await tx.user.delete({ where: { id: userId } });
        } else {
          // Historical orders exist: Redact PII to preserve financial & audit integrity
          const linkedAddressIds = historicalOrders
            .map((o) => o.addressId)
            .filter((id): id is string => Boolean(id));

          if (linkedAddressIds.length > 0) {
            await tx.address.deleteMany({
              where: {
                userId,
                id: { notIn: linkedAddressIds },
              },
            });
            await tx.address.updateMany({
              where: { id: { in: linkedAddressIds } },
              data: {
                fullName: 'Deleted Customer',
                phone: '0000000000',
                addressLine1: '[Redacted for Privacy]',
                addressLine2: null,
              },
            });
          } else {
            await tx.address.deleteMany({ where: { userId } });
          }

          // Anonymize the user record so orders remain referentially intact
          await tx.user.update({
            where: { id: userId },
            data: {
              firstName: 'Deleted',
              lastName: 'Customer',
              email: `deleted_${userId}@anonymized.invalid`,
              phone: null,
              passwordHash: null,
              googleId: null,
              role: 'customer',
              status: 'inactive',
              emailVerified: false,
              refreshToken: null,
              resetToken: null,
              resetTokenExpiry: null,
            },
          });
        }

        // 4. Record system audit event without sensitive personal data
        await tx.auditLog.create({
          data: {
            action: 'ACCOUNT_DELETED',
            entity: 'User',
            entityId: userId,
            userId: null,
          },
        });
      },
      { timeout: 15000 },
    );

    this.clearUsersCache();

    return {
      success: true,
      message: 'Your account has been deleted successfully.',
    };
  }
}

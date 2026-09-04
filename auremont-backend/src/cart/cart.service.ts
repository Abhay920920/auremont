import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { Cart } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  /**
   * Lean, performance-optimized projection for cart and its items.
   * Strips out unneeded heavy text columns (descriptions, JSON schemas, SEO overrides)
   * while returning exact fields consumed by frontend bag, drawers, and checkout.
   */
  private readonly cartSelect = {
    id: true,
    userId: true,
    status: true,
    createdAt: true,
    updatedAt: true,
    items: {
      orderBy: { id: 'asc' as const },
      select: {
        id: true,
        cartId: true,
        productId: true,
        quantity: true,
        unitPrice: true,
        subtotal: true,
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            salePrice: true,
            weightGrams: true,
            stockQty: true,
            thumbnailUrl: true,
          },
        },
      },
    },
  };

  private cache = new Map<string, { data: any; expiresAt: number }>();
  private inflight = new Map<string, Promise<any>>();
  private readonly CACHE_TTL_MS = 5000;

  invalidateCart(cartId?: string, userId?: string) {
    if (cartId) this.cache.delete(`cart:id:${cartId}`);
    if (userId) this.cache.delete(`cart:user:${userId}`);
  }

  async getCart(cartId?: string, userId?: string): Promise<Cart | null> {
    const isUuid = (val?: string) =>
      typeof val === 'string' &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(val);

    const safeCartId = isUuid(cartId) ? cartId : undefined;
    const safeUserId = isUuid(userId) ? userId : undefined;

    const cacheKey = safeCartId ? `cart:id:${safeCartId}` : (safeUserId ? `cart:user:${safeUserId}` : null);
    if (cacheKey) {
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() <= cached.expiresAt) return cached.data;
      if (this.inflight.has(cacheKey)) return this.inflight.get(cacheKey);
    }

    const fetchPromise = (async () => {
      let cart: any = null;

      if (safeCartId) {
        try {
          cart = await this.prisma.cart.findUnique({
            where: { id: safeCartId },
            select: this.cartSelect,
          });

          // Inactive or already-ordered carts must never be returned as active shopping carts
          if (cart && cart.status !== 'active') {
            cart = null;
          }
        } catch {
          cart = null;
        }
      }

      if (!cart && safeUserId) {
        try {
          cart = await this.prisma.cart.findFirst({
            where: { userId: safeUserId, status: 'active' },
            select: this.cartSelect,
          });
        } catch {
          cart = null;
        }
      }

      if (!cart) {
        return null;
      }

      if (cart.userId && userId && cart.userId !== userId) {
        throw new ForbiddenException('You do not have permission to access this cart');
      }

      if (cart.userId && !userId) {
        return null;
      }

      return cart;
    })().finally(() => {
      if (cacheKey) this.inflight.delete(cacheKey);
    });

    if (cacheKey) this.inflight.set(cacheKey, fetchPromise);
    const result = await fetchPromise;
    if (cacheKey) {
      this.cache.set(cacheKey, { data: result, expiresAt: Date.now() + this.CACHE_TTL_MS });
    }
    return result;
  }

  async createCart(userId?: string): Promise<Cart> {
    return this.prisma.cart.create({
      data: {
        userId: userId || null,
        status: 'active',
      },
      select: this.cartSelect,
    }) as unknown as Promise<Cart>;
  }

  async addItemToCart(dto: { cartId?: string; userId?: string; productId: string; quantity: number }): Promise<Cart> {
    if (!dto.quantity || dto.quantity <= 0 || !Number.isInteger(dto.quantity)) {
      throw new BadRequestException('Quantity must be a positive integer');
    }

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(dto.productId);
    const productWhere = isUuid
      ? { id: dto.productId }
      : { OR: [{ sku: dto.productId }, { slug: dto.productId }] };

    // Parallelize cart existence check and product lookup into a single concurrent round trip
    const [cartValidation, product] = await Promise.all([
      dto.cartId
        ? this.prisma.cart.findUnique({
            where: { id: dto.cartId },
            select: { id: true, userId: true, status: true },
          })
        : (dto.userId
            ? this.prisma.cart.findFirst({
                where: { userId: dto.userId, status: 'active' },
                select: { id: true, userId: true, status: true },
              })
            : Promise.resolve(null)),
      this.prisma.product.findFirst({
        where: productWhere,
        select: { id: true, name: true, price: true, salePrice: true, stockQty: true },
      }),
    ]);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    let activeCart = cartValidation;
    if (activeCart && activeCart.userId && dto.userId && activeCart.userId !== dto.userId) {
      throw new ForbiddenException('You do not have permission to access this cart');
    }

    if (!activeCart || activeCart.status !== 'active') {
      activeCart = await this.prisma.cart.create({
        data: {
          userId: dto.userId || null,
          status: 'active',
        },
        select: { id: true, userId: true, status: true },
      });
    }

    const unitPrice = product.salePrice || product.price;

    // Direct index seek on compound unique @@unique([cartId, productId]), with fallback for unit test mocks
    let existingItem = this.prisma.cartItem.findUnique
      ? await this.prisma.cartItem.findUnique({
          where: {
            cartId_productId: {
              cartId: activeCart.id,
              productId: product.id,
            },
          },
          select: { id: true, quantity: true },
        })
      : null;

    if (!existingItem && this.prisma.cartItem.findFirst) {
      existingItem = await this.prisma.cartItem.findFirst({
        where: {
          cartId: activeCart.id,
          productId: product.id,
        },
        select: { id: true, quantity: true },
      });
    }

    if (existingItem) {
      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: { increment: dto.quantity },
          subtotal: { increment: Number(unitPrice) * dto.quantity },
        },
      });
    } else {
      try {
        await this.prisma.cartItem.create({
          data: {
            cartId: activeCart.id,
            productId: product.id,
            quantity: dto.quantity,
            unitPrice: unitPrice,
            subtotal: Number(unitPrice) * dto.quantity,
          },
        });
      } catch (err: any) {
        // P2002: race condition handled gracefully with atomic DB increment
        if (err?.code === 'P2002') {
          await this.prisma.cartItem.update({
            where: {
              cartId_productId: {
                cartId: activeCart.id,
                productId: product.id,
              },
            },
            data: {
              quantity: { increment: dto.quantity },
              subtotal: { increment: Number(unitPrice) * dto.quantity },
            },
          });
        } else {
          throw err;
        }
      }
    }

    this.invalidateCart(activeCart.id, dto.userId);
    return this.getCart(activeCart.id, dto.userId) as Promise<Cart>;
  }

  async updateItemQuantity(itemId: string, quantity: number, userId?: string, cartId?: string): Promise<Cart> {
    if (!quantity || quantity <= 0 || !Number.isInteger(quantity)) {
      throw new BadRequestException('Quantity must be a positive integer');
    }

    const item = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
      select: {
        id: true,
        cartId: true,
        unitPrice: true,
        cart: { select: { userId: true } },
      },
    });

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    // Authenticated user check
    if (item.cart.userId) {
      if (item.cart.userId !== userId) {
        throw new ForbiddenException('You do not have permission to modify this cart');
      }
    } else {
      // Guest cart check: caller must match the item's cartId if provided, or be unauthenticated for that cart
      if (cartId && item.cartId !== cartId) {
        throw new ForbiddenException('You do not have permission to modify this cart');
      }
    }

    const subtotal = Number(item.unitPrice) * quantity;

    await this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity, subtotal },
    });

    this.invalidateCart(item.cartId, userId);
    return this.getCart(item.cartId, userId) as Promise<Cart>;
  }

  async removeItem(itemId: string, userId?: string, cartId?: string): Promise<Cart> {
    const item = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
      select: {
        id: true,
        cartId: true,
        cart: { select: { userId: true } },
      },
    });

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    // Authenticated user check
    if (item.cart.userId) {
      if (item.cart.userId !== userId) {
        throw new ForbiddenException('You do not have permission to modify this cart');
      }
    } else {
      // Guest cart check: caller must match the item's cartId if provided
      if (cartId && item.cartId !== cartId) {
        throw new ForbiddenException('You do not have permission to modify this cart');
      }
    }

    await this.prisma.cartItem.delete({ where: { id: itemId } });
    
    this.invalidateCart(item.cartId, userId);
    return this.getCart(item.cartId, userId) as Promise<Cart>;
  }

  async mergeCart(guestCartId: string, userId: string): Promise<Cart> {
    const guestCart = await this.prisma.cart.findUnique({
      where: { id: guestCartId },
      include: { items: true },
    });

    if (!guestCart || guestCart.userId) {
      let userCart = await this.getCart(undefined, userId);
      if (!userCart) {
        userCart = await this.createCart(userId);
      }
      return userCart;
    }

    const userCart = await this.getCart(undefined, userId);
    if (!userCart) {
      await this.prisma.cart.update({
        where: { id: guestCartId },
        data: { userId },
      });
      return this.getCart(guestCartId, userId) as Promise<Cart>;
    }

    await Promise.all(
      guestCart.items.map(async (item) => {
        const existingItem = await this.prisma.cartItem.findUnique({
          where: {
            cartId_productId: {
              cartId: userCart.id,
              productId: item.productId,
            },
          },
          select: { id: true, quantity: true, unitPrice: true },
        });

        if (existingItem) {
          const newQuantity = existingItem.quantity + item.quantity;
          const newSubtotal = Number(existingItem.unitPrice) * newQuantity;
          await this.prisma.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: newQuantity, subtotal: newSubtotal },
          });
        } else {
          await this.prisma.cartItem.create({
            data: {
              cartId: userCart.id,
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              subtotal: item.subtotal,
            },
          });
        }
      })
    );

    await this.prisma.cartItem.deleteMany({ where: { cartId: guestCartId } });
    await this.prisma.cart.delete({ where: { id: guestCartId } });

    this.invalidateCart(guestCartId, userId);
    this.invalidateCart(userCart.id, userId);
    return this.getCart(undefined, userId) as Promise<Cart>;
  }
}


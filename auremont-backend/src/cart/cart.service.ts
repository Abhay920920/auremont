import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { Cart } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCart(cartId?: string, userId?: string): Promise<Cart | null> {
    let cart: any = null;

    if (cartId) {
      cart = await this.prisma.cart.findFirst({
        where: { id: cartId },
        include: {
          items: {
            include: { product: true },
            orderBy: { id: 'asc' },
          },
        },
      });
    }

    if (!cart && userId) {
      cart = await this.prisma.cart.findFirst({
        where: { userId, status: 'active' },
        include: {
          items: {
            include: { product: true },
            orderBy: { id: 'asc' },
          },
        },
      });
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
  }

  async createCart(userId?: string): Promise<Cart> {
    return this.prisma.cart.create({
      data: {
        userId: userId || null,
        status: 'active',
      },
    });
  }

  async addItemToCart(dto: { cartId?: string; userId?: string; productId: string; quantity: number }): Promise<Cart> {
    if (!dto.quantity || dto.quantity <= 0 || !Number.isInteger(dto.quantity)) {
      throw new BadRequestException('Quantity must be a positive integer');
    }
    let cart = await this.getCart(dto.cartId, dto.userId);
    
    if (!cart) {
      cart = await this.createCart(dto.userId);
    }

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(dto.productId);
    const whereOr: any[] = [
      { sku: dto.productId },
      { slug: dto.productId },
    ];
    if (isUuid) {
      whereOr.push({ id: dto.productId });
    }

    const product = await this.prisma.product.findFirst({
      where: { OR: whereOr },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const unitPrice = product.salePrice || product.price;
    const subtotal = Number(unitPrice) * dto.quantity;

    const existingItem = await this.prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId: product.id },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + dto.quantity;
      const newSubtotal = Number(unitPrice) * newQuantity;
      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity, subtotal: newSubtotal },
      });
    } else {
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: product.id,
          quantity: dto.quantity,
          unitPrice: unitPrice,
          subtotal: subtotal,
        },
      });
    }

    return this.getCart(cart.id, dto.userId) as Promise<Cart>;
  }

  async updateItemQuantity(itemId: string, quantity: number, userId?: string): Promise<Cart> {
    if (!quantity || quantity <= 0 || !Number.isInteger(quantity)) {
      throw new BadRequestException('Quantity must be a positive integer');
    }
    const item = await this.prisma.cartItem.findUnique({ where: { id: itemId }, include: { cart: true } });
    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    if (item.cart.userId && item.cart.userId !== userId) {
      throw new ForbiddenException('You do not have permission to modify this cart');
    }

    const subtotal = Number(item.unitPrice) * quantity;

    await this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity, subtotal },
    });

    return this.getCart(item.cartId, userId) as Promise<Cart>;
  }

  async removeItem(itemId: string, userId?: string): Promise<Cart> {
    const item = await this.prisma.cartItem.findUnique({ where: { id: itemId }, include: { cart: true } });
    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    if (item.cart.userId && item.cart.userId !== userId) {
      throw new ForbiddenException('You do not have permission to modify this cart');
    }

    await this.prisma.cartItem.delete({ where: { id: itemId } });
    
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
        const existingItem = await this.prisma.cartItem.findFirst({
          where: { cartId: userCart.id, productId: item.productId },
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

    return this.getCart(undefined, userId) as Promise<Cart>;
  }
}

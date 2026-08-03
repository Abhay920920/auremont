import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaClient, Cart, CartItem } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class CartService {
  async getCart(cartId?: string, userId?: string): Promise<Cart | null> {
    const where: any = {};
    if (cartId) {
      where.id = cartId;
    } else if (userId) {
      where.userId = userId;
      where.status = 'active';
    } else {
      return null;
    }

    const cart = await prisma.cart.findFirst({
      where,
      include: {
        items: {
          include: { product: true },
          orderBy: { id: 'asc' },
        },
      },
    });

    if (cart && cart.userId && cart.userId !== userId) {
      // Cart belongs to a user, but either no user is logged in, or a different user is logged in
      throw new ForbiddenException('You do not have permission to access this cart');
    }
    
    return cart;
  }

  async createCart(userId?: string): Promise<Cart> {
    return prisma.cart.create({
      data: {
        userId: userId || null,
        status: 'active',
      },
    });
  }

  async addItemToCart(dto: { cartId?: string; userId?: string; productId: string; quantity: number }): Promise<Cart> {
    let cart = await this.getCart(dto.cartId, dto.userId);
    
    if (!cart) {
      cart = await this.createCart(dto.userId);
    }

    const product = await prisma.product.findUnique({ where: { id: dto.productId } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const unitPrice = product.salePrice || product.price;
    const subtotal = Number(unitPrice) * dto.quantity;

    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId: dto.productId },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + dto.quantity;
      const newSubtotal = Number(unitPrice) * newQuantity;
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity, subtotal: newSubtotal },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: dto.productId,
          quantity: dto.quantity,
          unitPrice: unitPrice,
          subtotal: subtotal,
        },
      });
    }

    return this.getCart(cart.id, dto.userId) as Promise<Cart>;
  }

  async updateItemQuantity(itemId: string, quantity: number, userId?: string): Promise<Cart> {
    const item = await prisma.cartItem.findUnique({ where: { id: itemId }, include: { cart: true } });
    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    if (item.cart.userId && item.cart.userId !== userId) {
      throw new ForbiddenException('You do not have permission to modify this cart');
    }

    const subtotal = Number(item.unitPrice) * quantity;

    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity, subtotal },
    });

    return this.getCart(item.cartId, userId) as Promise<Cart>;
  }

  async removeItem(itemId: string, userId?: string): Promise<Cart> {
    const item = await prisma.cartItem.findUnique({ where: { id: itemId }, include: { cart: true } });
    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    if (item.cart.userId && item.cart.userId !== userId) {
      throw new ForbiddenException('You do not have permission to modify this cart');
    }

    await prisma.cartItem.delete({ where: { id: itemId } });
    
    return this.getCart(item.cartId, userId) as Promise<Cart>;
  }

  async mergeCart(guestCartId: string, userId: string): Promise<Cart> {
    const guestCart = await prisma.cart.findUnique({
      where: { id: guestCartId },
      include: { items: true },
    });

    if (!guestCart || guestCart.userId) {
      // If no guest cart, or the cart already belongs to a user, do nothing or just return user's active cart
      let userCart = await this.getCart(undefined, userId);
      if (!userCart) {
        userCart = await this.createCart(userId);
      }
      return userCart;
    }

    let userCart = await this.getCart(undefined, userId);
    if (!userCart) {
      // If user has no cart, just take over the guest cart
      await prisma.cart.update({
        where: { id: guestCartId },
        data: { userId },
      });
      return this.getCart(guestCartId, userId) as Promise<Cart>;
    }

    // Otherwise, move items from guest cart to user cart
    for (const item of guestCart.items) {
      const existingItem = await prisma.cartItem.findFirst({
        where: { cartId: userCart.id, productId: item.productId },
      });

      if (existingItem) {
        const newQuantity = existingItem.quantity + item.quantity;
        const newSubtotal = Number(existingItem.unitPrice) * newQuantity;
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: newQuantity, subtotal: newSubtotal },
        });
      } else {
        await prisma.cartItem.create({
          data: {
            cartId: userCart.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            subtotal: item.subtotal,
          },
        });
      }
    }

    // Delete the old guest cart and its remaining items
    await prisma.cartItem.deleteMany({ where: { cartId: guestCartId } });
    await prisma.cart.delete({ where: { id: guestCartId } });

    return this.getCart(undefined, userId) as Promise<Cart>;
  }
}

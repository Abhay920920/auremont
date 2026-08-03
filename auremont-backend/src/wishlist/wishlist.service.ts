import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaClient, Wishlist } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class WishlistService {
  async getWishlist(userId: string): Promise<Wishlist[]> {
    return prisma.wishlist.findMany({
      where: { userId },
      include: { product: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async addProduct(userId: string, productId: string): Promise<Wishlist> {
    const existing = await prisma.wishlist.findFirst({
      where: { userId, productId }
    });

    if (existing) {
      throw new BadRequestException('Product already in wishlist');
    }

    return prisma.wishlist.create({
      data: {
        userId,
        productId
      },
      include: { product: true }
    });
  }

  async removeProduct(userId: string, productId: string): Promise<void> {
    const existing = await prisma.wishlist.findFirst({
      where: { userId, productId }
    });

    if (!existing) {
      throw new NotFoundException('Product not in wishlist');
    }

    await prisma.wishlist.delete({
      where: { id: existing.id }
    });
  }
}

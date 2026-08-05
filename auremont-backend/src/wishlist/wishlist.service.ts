import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Wishlist } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  async getWishlist(userId: string): Promise<Wishlist[]> {
    return this.prisma.wishlist.findMany({
      where: { userId },
      include: { product: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async addProduct(userId: string, productId: string): Promise<Wishlist> {
    const existing = await this.prisma.wishlist.findFirst({
      where: { userId, productId }
    });

    if (existing) {
      throw new BadRequestException('Product already in wishlist');
    }

    return this.prisma.wishlist.create({
      data: {
        userId,
        productId
      },
      include: { product: true }
    });
  }

  async removeProduct(userId: string, productId: string): Promise<void> {
    const existing = await this.prisma.wishlist.findFirst({
      where: { userId, productId }
    });

    if (!existing) {
      throw new NotFoundException('Product not in wishlist');
    }

    await this.prisma.wishlist.delete({
      where: { id: existing.id }
    });
  }
}

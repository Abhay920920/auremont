import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';

@Controller('wishlists')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  async getMyWishlist(@GetUser() user: any) {
    return this.wishlistService.getWishlist(user.id);
  }

  @Post()
  async addProduct(@Body() body: { productId: string }, @GetUser() user: any) {
    return this.wishlistService.addProduct(user.id, body.productId);
  }

  @Delete(':productId')
  async removeProduct(
    @Param('productId') productId: string,
    @GetUser() user: any
  ) {
    await this.wishlistService.removeProduct(user.id, productId);
    return { success: true };
  }
}

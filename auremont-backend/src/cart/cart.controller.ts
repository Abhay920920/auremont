import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, ForbiddenException } from '@nestjs/common';
import { CartService } from './cart.service';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { MergeCartDto } from './dto/merge-cart.dto';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Controller('cart')
@UseGuards(OptionalJwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@Query('cartId') cartId?: string, @GetUser() user?: any) {
    // If we have an authenticated user, we fetch their cart
    const userId = user?.id;
    return this.cartService.getCart(cartId, userId);
  }

  @Post('items')
  async addItem(@Body() body: AddCartItemDto, @GetUser() user?: any) {
    return this.cartService.addItemToCart({ ...body, userId: user?.id });
  }

  @Post('merge')
  @UseGuards(JwtAuthGuard) // Requires authentication to merge TO
  async mergeCart(@Body() dto: MergeCartDto, @GetUser() user: any) {
    return this.cartService.mergeCart(dto.guestCartId, user.id);
  }

  @Patch('items/:id')
  async updateItem(@Param('id') id: string, @Body() body: UpdateCartItemDto, @GetUser() user?: any) {
    return this.cartService.updateItemQuantity(id, body.quantity, user?.id);
  }

  @Delete('items/:id')
  async removeItem(@Param('id') id: string, @GetUser() user?: any) {
    return this.cartService.removeItem(id, user?.id);
  }
}

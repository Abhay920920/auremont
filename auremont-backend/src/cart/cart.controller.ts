import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Headers, UseGuards, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { CartService } from './cart.service';
import { CartRecoveryService } from './cart-recovery.service';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { MergeCartDto } from './dto/merge-cart.dto';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

// Cart mutations are high-frequency user actions (every product add = 1 request).
// Throttling by IP collapses under shared-IP environments (load balancers, NAT).
// Rate limiting for cart should be applied at CDN/WAF layer, not application level.
@SkipThrottle()
@Controller('cart')
@UseGuards(OptionalJwtAuthGuard)
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private readonly cartRecoveryService: CartRecoveryService,
  ) {}

  @Get()
  async getCart(@Query('cartId') cartId?: string, @GetUser() user?: any) {
    const cleanCartId = (cartId && cartId !== 'null' && cartId !== 'undefined' && cartId.trim() !== '') ? cartId.trim() : undefined;
    const userId = user?.id;
    return this.cartService.getCart(cleanCartId, userId);
  }

  @Post('recovery')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async triggerCartRecovery(
    @GetUser() user?: any,
    @Headers('x-worker-secret') workerSecret?: string,
  ) {
    const configuredSecret = process.env.CART_RECOVERY_WORKER_SECRET;
    const isAuthorizedWorker = configuredSecret && workerSecret === configuredSecret;
    const isAdmin = user && (user.role === 'admin' || user.role === 'SUPER_ADMIN');

    if (!isAuthorizedWorker && !isAdmin) {
      throw new ForbiddenException('Unauthorized: Cart recovery requires admin privileges or worker secret.');
    }

    return this.cartRecoveryService.processAbandonedCarts();
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
  async updateItem(
    @Param('id') id: string,
    @Body() body: UpdateCartItemDto,
    @Query('cartId') cartId?: string,
    @GetUser() user?: any
  ) {
    return this.cartService.updateItemQuantity(id, body.quantity, user?.id, cartId);
  }

  @Delete('items/:id')
  async removeItem(
    @Param('id') id: string,
    @Query('cartId') cartId?: string,
    @GetUser() user?: any
  ) {
    return this.cartService.removeItem(id, user?.id, cartId);
  }
}

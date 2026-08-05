import { Controller, Post, Body, Get, Param, UseGuards, Delete, Patch, Query, ParseUUIDPipe } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { GetUser } from '../auth/get-user.decorator';

import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // ── PUBLIC / USER ──────────────────────────────────────────────────────────

  @Post()
  @UseGuards(OptionalJwtAuthGuard)
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  async placeOrder(@Body() dto: CreateOrderDto, @GetUser() user: any) {
    const order = await this.ordersService.createOrder({
      ...dto,
      userId: user?.id
    });

    // Initiate Razorpay payment session
    const paymentSession = await this.ordersService.initializePayment(
      order.id,
      Number(order.total),
    );

    return {
      ...order,
      paymentSession,
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMyOrders(@GetUser() user: any) {
    return this.ordersService.getUserOrders(user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getOrder(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: any) {
    return this.ordersService.getOrderById(id, user.id);
  }

  @Delete(':id/cancel')
  @UseGuards(JwtAuthGuard)
  async cancelOrder(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: any) {
    return this.ordersService.cancelOrder(id, user.id);
  }

  // ── ADMIN ──────────────────────────────────────────────────────────────────

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getAllOrders(@Query() query: any) {
    return this.ordersService.getAllOrders(query);
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getOrderAdmin(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.getOrderByIdAdmin(id);
  }

  @Patch('admin/:id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
    @GetUser() user: any
  ) {
    return this.ordersService.updateOrderStatus(id, dto, user.id);
  }
}

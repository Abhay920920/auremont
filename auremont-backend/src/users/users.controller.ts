import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AddressDto } from './dto/address.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@GetUser() user: any) {
    return this.usersService.getProfile(user.id);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@GetUser() user: any, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(user.id, dto);
  }

  @Post('me/change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(@GetUser() user: any, @Body() dto: ChangePasswordDto) {
    return this.usersService.changePassword(user.id, dto);
  }

  // --- Addresses ---

  @Get('me/addresses')
  @UseGuards(JwtAuthGuard)
  async getAddresses(@GetUser() user: any) {
    return this.usersService.getAddresses(user.id);
  }

  @Post('me/addresses')
  @UseGuards(JwtAuthGuard)
  async addAddress(@GetUser() user: any, @Body() dto: AddressDto) {
    return this.usersService.addAddress(user.id, dto);
  }

  @Patch('me/addresses/:id')
  @UseGuards(JwtAuthGuard)
  async updateAddress(@GetUser() user: any, @Param('id') id: string, @Body() dto: AddressDto) {
    return this.usersService.updateAddress(user.id, id, dto);
  }

  @Patch('me/addresses/:id/default')
  @UseGuards(JwtAuthGuard)
  async setDefaultAddress(@GetUser() user: any, @Param('id') id: string) {
    return this.usersService.setDefaultAddress(user.id, id);
  }

  @Delete('me/addresses/:id')
  @UseGuards(JwtAuthGuard)
  async deleteAddress(@GetUser() user: any, @Param('id') id: string) {
    return this.usersService.deleteAddress(user.id, id);
  }

  // --- ADMIN ---

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getUserDetail(@Param('id') id: string) {
    return this.usersService.getUserDetailAdmin(id);
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async deleteUser(@GetUser() admin: any, @Param('id') id: string) {
    return this.usersService.deleteUserAdmin(id, admin?.id);
  }
}

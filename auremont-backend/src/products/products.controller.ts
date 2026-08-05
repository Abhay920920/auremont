import { Controller, Get, Post, Patch, Delete, Body, Param, Query, NotFoundException, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { GetUser } from '../auth/get-user.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AddProductImageDto } from './dto/add-product-image.dto';
import { AddProductAttributeDto } from './dto/add-product-attribute.dto';
import { AdjustInventoryDto } from './dto/adjust-inventory.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // ── PUBLIC ─────────────────────────────────────────────────────────────────

  @Get()
  async findAll(@Query() query: any) {
    return this.productsService.findAll(query);
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    const product = await this.productsService.findBySlug(slug);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  // ── ADMIN ──────────────────────────────────────────────────────────────────

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async createProduct(@Body() dto: CreateProductDto, @GetUser() user: any) {
    return this.productsService.createProduct(dto, user?.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto, @GetUser() user: any) {
    return this.productsService.updateProduct(id, dto, user?.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async deleteProduct(@Param('id') id: string, @GetUser() user: any) {
    return this.productsService.deleteProduct(id, user?.id);
  }

  @Post(':id/images')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async addImage(@Param('id') id: string, @Body() dto: AddProductImageDto, @GetUser() user: any) {
    return this.productsService.addImage(id, dto, user?.id);
  }

  @Delete(':id/images/:imageId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async removeImage(@Param('id') id: string, @Param('imageId') imageId: string, @GetUser() user: any) {
    return this.productsService.removeImage(id, imageId, user?.id);
  }

  @Post(':id/attributes')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async addAttribute(@Param('id') id: string, @Body() dto: AddProductAttributeDto, @GetUser() user: any) {
    return this.productsService.addAttribute(id, dto, user?.id);
  }

  @Delete(':id/attributes/:attrId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async removeAttribute(@Param('id') id: string, @Param('attrId') attrId: string, @GetUser() user: any) {
    return this.productsService.removeAttribute(id, attrId, user?.id);
  }

  @Post(':id/inventory')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async adjustInventory(@Param('id') id: string, @Body() dto: AdjustInventoryDto, @GetUser() user: any) {
    return this.productsService.adjustInventory(id, dto, user?.id);
  }
}

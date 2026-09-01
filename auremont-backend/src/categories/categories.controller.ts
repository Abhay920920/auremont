import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Res } from '@nestjs/common';
import { Response } from 'express';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { GetUser } from '../auth/get-user.decorator';
import { CreateCategoryDto, UpdateCategoryDto, CreateCollectionDto, UpdateCollectionDto } from './dto/categories.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // ── PUBLIC ─────────────────────────────────────────────────────────────────

  @Get()
  async getAllCategories(@Res({ passthrough: true }) res: Response) {
    res.setHeader('Cache-Control', 'public, max-age=120, stale-while-revalidate=600');
    return this.categoriesService.getAllCategories();
  }

  @Get('collections/all')
  async getAllCollections(@Res({ passthrough: true }) res: Response) {
    res.setHeader('Cache-Control', 'public, max-age=120, stale-while-revalidate=600');
    return this.categoriesService.getAllCollections();
  }

  @Get('collections/:slug')
  async getCollection(@Param('slug') slug: string, @Res({ passthrough: true }) res: Response) {
    res.setHeader('Cache-Control', 'public, max-age=120, stale-while-revalidate=600');
    return this.categoriesService.getCollectionBySlug(slug);
  }

  @Get(':slug')
  async getCategory(@Param('slug') slug: string, @Res({ passthrough: true }) res: Response) {
    res.setHeader('Cache-Control', 'public, max-age=120, stale-while-revalidate=600');
    return this.categoriesService.getCategoryBySlug(slug);
  }

  // ── ADMIN: CATEGORIES ─────────────────────────────────────────────────────

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async createCategory(@Body() dto: CreateCategoryDto, @GetUser() user: any) {
    return this.categoriesService.createCategory(dto, user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async updateCategory(@Param('id') id: string, @Body() dto: UpdateCategoryDto, @GetUser() user: any) {
    return this.categoriesService.updateCategory(id, dto, user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async deleteCategory(@Param('id') id: string, @GetUser() user: any) {
    return this.categoriesService.deleteCategory(id, user.id);
  }

  // ── ADMIN: COLLECTIONS ────────────────────────────────────────────────────

  @Post('collections')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async createCollection(@Body() dto: CreateCollectionDto, @GetUser() user: any) {
    return this.categoriesService.createCollection(dto, user.id);
  }

  @Patch('collections/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async updateCollection(@Param('id') id: string, @Body() dto: UpdateCollectionDto, @GetUser() user: any) {
    return this.categoriesService.updateCollection(id, dto, user.id);
  }

  @Delete('collections/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async deleteCollection(@Param('id') id: string, @GetUser() user: any) {
    return this.categoriesService.deleteCollection(id, user.id);
  }
}

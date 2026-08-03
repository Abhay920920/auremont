import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { Category, Collection } from '@prisma/client';
import { CreateCategoryDto, UpdateCategoryDto, CreateCollectionDto, UpdateCollectionDto } from './dto/categories.dto';

@Injectable()
export class CategoriesService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
  ) {}

  async getAllCategories(): Promise<Category[]> {
    return this.prisma.category.findMany({ where: { status: true }, orderBy: { name: 'asc' } });
  }

  async getCategoryBySlug(slug: string): Promise<Category> {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: { products: { where: { status: true }, include: { images: true } } },
    });
    if (!category || !category.status) throw new NotFoundException('Category not found');
    return category;
  }

  async getAllCollections(): Promise<Collection[]> {
    return this.prisma.collection.findMany({ where: { status: true }, orderBy: { name: 'asc' } });
  }

  async getCollectionBySlug(slug: string): Promise<Collection> {
    const collection = await this.prisma.collection.findUnique({
      where: { slug },
      include: { products: { where: { status: true }, include: { images: true } } },
    });
    if (!collection || !collection.status) throw new NotFoundException('Collection not found');
    return collection;
  }

  // ── ADMIN ──────────────────────────────────────────────────────────────────

  async createCategory(dto: CreateCategoryDto, adminId: string): Promise<Category> {
    const cat = await this.prisma.category.create({ data: dto });
    await this.audit.log({ userId: adminId, action: 'CREATE_CATEGORY', entity: 'Category', entityId: cat.id });
    return cat;
  }

  async updateCategory(id: string, dto: UpdateCategoryDto, adminId: string): Promise<Category> {
    const cat = await this.prisma.category.update({ where: { id }, data: dto });
    await this.audit.log({ userId: adminId, action: 'UPDATE_CATEGORY', entity: 'Category', entityId: id });
    return cat;
  }

  async deleteCategory(id: string, adminId: string): Promise<Category> {
    const cat = await this.prisma.category.update({ where: { id }, data: { status: false } });
    await this.audit.log({ userId: adminId, action: 'DELETE_CATEGORY', entity: 'Category', entityId: id });
    return cat;
  }

  async createCollection(dto: CreateCollectionDto, adminId: string): Promise<Collection> {
    const col = await this.prisma.collection.create({ data: dto });
    await this.audit.log({ userId: adminId, action: 'CREATE_COLLECTION', entity: 'Collection', entityId: col.id });
    return col;
  }

  async updateCollection(id: string, dto: UpdateCollectionDto, adminId: string): Promise<Collection> {
    const col = await this.prisma.collection.update({ where: { id }, data: dto });
    await this.audit.log({ userId: adminId, action: 'UPDATE_COLLECTION', entity: 'Collection', entityId: id });
    return col;
  }

  async deleteCollection(id: string, adminId: string): Promise<Collection> {
    const col = await this.prisma.collection.update({ where: { id }, data: { status: false } });
    await this.audit.log({ userId: adminId, action: 'DELETE_COLLECTION', entity: 'Collection', entityId: id });
    return col;
  }
}

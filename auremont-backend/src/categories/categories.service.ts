import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { Category, Collection } from '@prisma/client';
import { CreateCategoryDto, UpdateCategoryDto, CreateCollectionDto, UpdateCollectionDto } from './dto/categories.dto';

@Injectable()
export class CategoriesService {
  private cache = new Map<string, { data: any; expiresAt: number }>();
  private readonly CACHE_TTL_MS = 60 * 1000;

  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
  ) {}

  private getCached(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    if (Date.now() > cached.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return cached.data;
  }

  private setCache(key: string, data: any) {
    if (this.cache.size > 100) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) this.cache.delete(oldestKey);
    }
    this.cache.set(key, { data, expiresAt: Date.now() + this.CACHE_TTL_MS });
  }

  clearCache() {
    this.cache.clear();
  }

  async getAllCategories(): Promise<Category[]> {
    const cached = this.getCached('categories:all');
    if (cached) return cached;
    const cats = await this.prisma.category.findMany({ where: { status: true }, orderBy: { name: 'asc' } });
    this.setCache('categories:all', cats);
    return cats;
  }

  async getCategoryBySlug(slug: string): Promise<Category> {
    const cached = this.getCached(`category:slug:${slug}`);
    if (cached) return cached;
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: { products: { where: { status: true }, include: { images: true } } },
    });
    if (!category || !category.status) throw new NotFoundException('Category not found');
    this.setCache(`category:slug:${slug}`, category);
    return category;
  }

  async getAllCollections(): Promise<Collection[]> {
    const cached = this.getCached('collections:all');
    if (cached) return cached;
    const collections = await this.prisma.collection.findMany({ where: { status: true }, orderBy: { name: 'asc' } });
    this.setCache('collections:all', collections);
    return collections;
  }

  async getCollectionBySlug(slug: string): Promise<Collection> {
    const cached = this.getCached(`collection:slug:${slug}`);
    if (cached) return cached;
    const collection = await this.prisma.collection.findUnique({
      where: { slug },
      include: { products: { where: { status: true }, include: { images: true } } },
    });
    if (!collection || !collection.status) throw new NotFoundException('Collection not found');
    this.setCache(`collection:slug:${slug}`, collection);
    return collection;
  }

  // ── ADMIN ──────────────────────────────────────────────────────────────────

  async createCategory(dto: CreateCategoryDto, adminId: string): Promise<Category> {
    this.clearCache();
    const cat = await this.prisma.category.create({ data: dto });
    await this.audit.log({ userId: adminId, action: 'CREATE_CATEGORY', entity: 'Category', entityId: cat.id });
    return cat;
  }

  async updateCategory(id: string, dto: UpdateCategoryDto, adminId: string): Promise<Category> {
    this.clearCache();
    const cat = await this.prisma.category.update({ where: { id }, data: dto });
    await this.audit.log({ userId: adminId, action: 'UPDATE_CATEGORY', entity: 'Category', entityId: id });
    return cat;
  }

  async deleteCategory(id: string, adminId: string): Promise<Category> {
    this.clearCache();
    const cat = await this.prisma.category.update({ where: { id }, data: { status: false } });
    await this.audit.log({ userId: adminId, action: 'DELETE_CATEGORY', entity: 'Category', entityId: id });
    return cat;
  }

  async createCollection(dto: CreateCollectionDto, adminId: string): Promise<Collection> {
    this.clearCache();
    const col = await this.prisma.collection.create({ data: dto });
    await this.audit.log({ userId: adminId, action: 'CREATE_COLLECTION', entity: 'Collection', entityId: col.id });
    return col;
  }

  async updateCollection(id: string, dto: UpdateCollectionDto, adminId: string): Promise<Collection> {
    this.clearCache();
    const col = await this.prisma.collection.update({ where: { id }, data: dto });
    await this.audit.log({ userId: adminId, action: 'UPDATE_COLLECTION', entity: 'Collection', entityId: id });
    return col;
  }

  async deleteCollection(id: string, adminId: string): Promise<Collection> {
    this.clearCache();
    const col = await this.prisma.collection.update({ where: { id }, data: { status: false } });
    await this.audit.log({ userId: adminId, action: 'DELETE_COLLECTION', entity: 'Collection', entityId: id });
    return col;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { Product } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AddProductImageDto } from './dto/add-product-image.dto';
import { AddProductAttributeDto } from './dto/add-product-attribute.dto';
import { AdjustInventoryDto } from './dto/adjust-inventory.dto';

@Injectable()
export class ProductsService {
  private cache = new Map<string, { data: any; expiresAt: number }>();
  private inflight = new Map<string, Promise<any>>();
  private readonly CACHE_TTL_MS = 60 * 1000; // 60 seconds TTL

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
    // Keep max 200 items in cache (LRU eviction)
    if (this.cache.size > 200) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) this.cache.delete(oldestKey);
    }
    this.cache.set(key, { data, expiresAt: Date.now() + this.CACHE_TTL_MS });
  }

  clearCache() {
    this.cache.clear();
    this.inflight.clear();
  }

  async findAll(query: any): Promise<any> {
    const { categoryId, collectionId, minPrice, maxPrice, page = 1, limit = 20, sort, search } = query;
    // Canonical deterministic cache key sorting query properties
    const canonicalKey = JSON.stringify({
      categoryId: categoryId || null,
      collectionId: collectionId || null,
      minPrice: minPrice || null,
      maxPrice: maxPrice || null,
      page: Number(page) || 1,
      limit: Number(limit) || 20,
      sort: sort || 'newest',
      search: search ? search.trim().toLowerCase() : null,
    });
    const cacheKey = `products:list:${canonicalKey}`;

    const cached = this.getCached(cacheKey);
    if (cached) {
      return cached;
    }

    // Single-flight request coalescing: prevent cache stampede
    if (this.inflight.has(cacheKey)) {
      return this.inflight.get(cacheKey);
    }

    const fetchPromise = (async () => {
      const where: any = { status: true };

      if (categoryId) where.categoryId = categoryId;
      if (collectionId) where.collectionId = collectionId;
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { shortDescription: { contains: search, mode: 'insensitive' } },
        ];
      }
      if (minPrice || maxPrice) {
        where.price = {};
        if (minPrice) where.price.gte = Number(minPrice);
        if (maxPrice) where.price.lte = Number(maxPrice);
      }

      const pageNumber = Math.max(1, Number(page));
      const take = Math.min(50, Math.max(1, Number(limit))); // safe maximum limit
      const skip = (pageNumber - 1) * take;

      let orderBy: any = { createdAt: 'desc' };
      if (sort === 'price_asc') orderBy = { price: 'asc' };
      else if (sort === 'price_desc') orderBy = { price: 'desc' };
      else if (sort === 'recommended') orderBy = { isFeatured: 'desc' };
      else if (sort === 'newest') orderBy = { createdAt: 'desc' };

      // Parallel non-blocking execution across pooler
      const [total, data] = await Promise.all([
        this.prisma.product.count({ where }),
        this.prisma.product.findMany({
          where,
          take,
          skip,
          orderBy,
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            salePrice: true,
            shortDescription: true,
            weightGrams: true,
            stockQty: true,
            thumbnailUrl: true,
            isFeatured: true,
            category: {
              select: { id: true, name: true, slug: true },
            },
            images: {
              take: 5,
              select: { imageUrl: true, isPrimary: true },
            },
          },
        }),
      ]);

      const formattedData = data.map(product => {
        const primaryImg = product.images.find(i => i.isPrimary)?.imageUrl || product.images[0]?.imageUrl;
        return {
          ...product,
          thumbnailUrl: product.thumbnailUrl || primaryImg || '/images/california-almonds-250g.png',
          primaryImage: primaryImg || product.thumbnailUrl || '/images/california-almonds-250g.png',
        };
      });

      const result = {
        data: formattedData,
        meta: {
          total,
          page: pageNumber,
          limit: take,
          lastPage: Math.ceil(total / take),
        }
      };

      this.setCache(cacheKey, result);
      return result;
    })().finally(() => {
      this.inflight.delete(cacheKey);
    });

    this.inflight.set(cacheKey, fetchPromise);
    return fetchPromise;
  }

  async findBySlug(slug: string): Promise<Product | null> {
    const cacheKey = `product:detail:${slug}`;
    const cached = this.getCached(cacheKey);
    if (cached) {
      return cached;
    }

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
    const product = await this.prisma.product.findFirst({
      where: isUuid ? { OR: [{ id: slug }, { slug }] } : { slug },
      include: {
        images: true,
        attributes: true,
        category: true,
        collection: true,
        reviews: {
          where: { status: 'approved' },
          include: { user: { select: { firstName: true, lastName: true } } },
        },
      },
    });

    if (product) {
      this.setCache(cacheKey, product);
    }
    return product;
  }

  // ── ADMIN ──────────────────────────────────────────────────────────────────

  async createProduct(dto: CreateProductDto, adminId?: string): Promise<Product> {
    this.clearCache();
    const product = await this.prisma.product.create({ data: { ...dto } });
    if (adminId) {
      try { await this.audit.log({ userId: adminId, action: 'CREATE_PRODUCT', entity: 'Product', entityId: product.id }); } catch (e) { /* noop */ }
    }
    return product;
  }

  async updateProduct(id: string, dto: UpdateProductDto, adminId?: string): Promise<Product> {
    this.clearCache();
    await this.findProductOrThrow(id);
    const product = await this.prisma.product.update({ where: { id }, data: { ...dto } });
    if (adminId) {
      try { await this.audit.log({ userId: adminId, action: 'UPDATE_PRODUCT', entity: 'Product', entityId: id }); } catch (e) { /* noop */ }
    }
    return product;
  }

  async deleteProduct(id: string, adminId?: string): Promise<Product> {
    this.clearCache();
    await this.findProductOrThrow(id);
    const product = await this.prisma.product.update({ where: { id }, data: { status: false } });
    if (adminId) {
      try { await this.audit.log({ userId: adminId, action: 'DELETE_PRODUCT', entity: 'Product', entityId: id }); } catch (e) { /* noop */ }
    }
    return product;
  }

  async addImage(productId: string, dto: AddProductImageDto, adminId?: string) {
    this.clearCache();
    await this.findProductOrThrow(productId);
    const image = await this.prisma.productImage.create({ data: { productId, ...dto } });
    if (adminId) {
      try { await this.audit.log({ userId: adminId, action: 'ADD_PRODUCT_IMAGE', entity: 'ProductImage', entityId: image.id }); } catch (e) { /* noop */ }
    }
    return image;
  }

  async removeImage(productId: string, imageId: string, adminId?: string) {
    this.clearCache();
    const image = await this.prisma.productImage.findUnique({ where: { id: imageId } });
    if (!image || image.productId !== productId) throw new NotFoundException('Image not found');
    await this.prisma.productImage.delete({ where: { id: imageId } });
    if (adminId) {
      try { await this.audit.log({ userId: adminId, action: 'REMOVE_PRODUCT_IMAGE', entity: 'ProductImage', entityId: imageId }); } catch (e) { /* noop */ }
    }
    return { success: true };
  }

  async addAttribute(productId: string, dto: AddProductAttributeDto, adminId?: string) {
    this.clearCache();
    await this.findProductOrThrow(productId);
    const attr = await this.prisma.productAttribute.create({ data: { productId, ...dto } });
    if (adminId) {
      try { await this.audit.log({ userId: adminId, action: 'ADD_PRODUCT_ATTRIBUTE', entity: 'ProductAttribute', entityId: attr.id }); } catch (e) { /* noop */ }
    }
    return attr;
  }

  async removeAttribute(productId: string, attrId: string, adminId?: string) {
    this.clearCache();
    const attr = await this.prisma.productAttribute.findUnique({ where: { id: attrId } });
    if (!attr || attr.productId !== productId) throw new NotFoundException('Attribute not found');
    await this.prisma.productAttribute.delete({ where: { id: attrId } });
    if (adminId) {
      try { await this.audit.log({ userId: adminId, action: 'REMOVE_PRODUCT_ATTRIBUTE', entity: 'ProductAttribute', entityId: attrId }); } catch (e) { /* noop */ }
    }
    return { success: true };
  }

  async adjustInventory(productId: string, dto: AdjustInventoryDto, adminId?: string) {
    this.clearCache();
    await this.findProductOrThrow(productId);
    const product = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.product.update({
        where: { id: productId },
        data: { stockQty: { increment: dto.changeQty } },
      });
      await tx.inventoryLog.create({
        data: { productId, changeQty: dto.changeQty, reason: dto.reason },
      });
      return updated;
    });
    if (adminId) {
      try { await this.audit.log({ userId: adminId, action: 'ADJUST_INVENTORY', entity: 'Product', entityId: productId }); } catch (e) { /* noop */ }
    }
    return product;
  }

  private async findProductOrThrow(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }
}

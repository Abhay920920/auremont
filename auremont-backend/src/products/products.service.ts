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
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
  ) {}

  async findAll(query: any): Promise<any> {
    const { categoryId, collectionId, minPrice, maxPrice, page = 1, limit = 20, sort } = query;
    const where: any = { status: true };

    if (categoryId) where.categoryId = categoryId;
    if (collectionId) where.collectionId = collectionId;
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

    const [total, data] = await this.prisma.$transaction([
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

    return {
      data: formattedData,
      meta: {
        total,
        page: pageNumber,
        limit: take,
        lastPage: Math.ceil(total / take),
      }
    };
  }

  async findBySlug(slug: string): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: { slug },
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
  }

  // ── ADMIN ──────────────────────────────────────────────────────────────────

  async createProduct(dto: CreateProductDto, adminId?: string): Promise<Product> {
    const product = await this.prisma.product.create({ data: { ...dto } });
    if (adminId) {
      try { await this.audit.log({ userId: adminId, action: 'CREATE_PRODUCT', entity: 'Product', entityId: product.id }); } catch (e) { /* noop */ }
    }
    return product;
  }

  async updateProduct(id: string, dto: UpdateProductDto, adminId?: string): Promise<Product> {
    await this.findProductOrThrow(id);
    const product = await this.prisma.product.update({ where: { id }, data: { ...dto } });
    if (adminId) {
      try { await this.audit.log({ userId: adminId, action: 'UPDATE_PRODUCT', entity: 'Product', entityId: id }); } catch (e) { /* noop */ }
    }
    return product;
  }

  async deleteProduct(id: string, adminId?: string): Promise<Product> {
    await this.findProductOrThrow(id);
    const product = await this.prisma.product.update({ where: { id }, data: { status: false } });
    if (adminId) {
      try { await this.audit.log({ userId: adminId, action: 'DELETE_PRODUCT', entity: 'Product', entityId: id }); } catch (e) { /* noop */ }
    }
    return product;
  }

  async addImage(productId: string, dto: AddProductImageDto, adminId?: string) {
    await this.findProductOrThrow(productId);
    const image = await this.prisma.productImage.create({ data: { productId, ...dto } });
    if (adminId) {
      try { await this.audit.log({ userId: adminId, action: 'ADD_PRODUCT_IMAGE', entity: 'ProductImage', entityId: image.id }); } catch (e) { /* noop */ }
    }
    return image;
  }

  async removeImage(productId: string, imageId: string, adminId?: string) {
    const image = await this.prisma.productImage.findUnique({ where: { id: imageId } });
    if (!image || image.productId !== productId) throw new NotFoundException('Image not found');
    await this.prisma.productImage.delete({ where: { id: imageId } });
    if (adminId) {
      try { await this.audit.log({ userId: adminId, action: 'REMOVE_PRODUCT_IMAGE', entity: 'ProductImage', entityId: imageId }); } catch (e) { /* noop */ }
    }
    return { success: true };
  }

  async addAttribute(productId: string, dto: AddProductAttributeDto, adminId?: string) {
    await this.findProductOrThrow(productId);
    const attr = await this.prisma.productAttribute.create({ data: { productId, ...dto } });
    if (adminId) {
      try { await this.audit.log({ userId: adminId, action: 'ADD_PRODUCT_ATTRIBUTE', entity: 'ProductAttribute', entityId: attr.id }); } catch (e) { /* noop */ }
    }
    return attr;
  }

  async removeAttribute(productId: string, attrId: string, adminId?: string) {
    const attr = await this.prisma.productAttribute.findUnique({ where: { id: attrId } });
    if (!attr || attr.productId !== productId) throw new NotFoundException('Attribute not found');
    await this.prisma.productAttribute.delete({ where: { id: attrId } });
    if (adminId) {
      try { await this.audit.log({ userId: adminId, action: 'REMOVE_PRODUCT_ATTRIBUTE', entity: 'ProductAttribute', entityId: attrId }); } catch (e) { /* noop */ }
    }
    return { success: true };
  }

  async adjustInventory(productId: string, dto: AdjustInventoryDto, adminId?: string) {
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

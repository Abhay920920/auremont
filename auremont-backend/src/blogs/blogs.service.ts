import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BlogsService {
  private cache = new Map<string, { data: any; expiresAt: number }>();
  private inflight = new Map<string, Promise<any>>();
  private readonly CACHE_TTL_MS = 60 * 1000;

  constructor(private prisma: PrismaService) {}

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
    this.inflight.clear();
  }

  async findAllPublished() {
    const cacheKey = 'blogs:all:published';
    const cached = this.getCached(cacheKey);
    if (cached) return cached;
    if (this.inflight.has(cacheKey)) return this.inflight.get(cacheKey);

    const fetchPromise = (async () => {
      const blogs = await this.prisma.blog.findMany({
        where: { published: true },
        orderBy: { publishedAt: 'desc' },
      });
      this.setCache(cacheKey, blogs);
      return blogs;
    })().finally(() => {
      this.inflight.delete(cacheKey);
    });

    this.inflight.set(cacheKey, fetchPromise);
    return fetchPromise;
  }

  async findAll() {
    // Admin only
    return this.prisma.blog.findMany({
      orderBy: { publishedAt: 'desc' },
    });
  }

  async findBySlug(slug: string) {
    const cacheKey = `blogs:slug:${slug}`;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;
    if (this.inflight.has(cacheKey)) return this.inflight.get(cacheKey);

    const fetchPromise = (async () => {
      const blog = await this.prisma.blog.findUnique({
        where: { slug }
      });
      if (!blog) throw new NotFoundException('Blog post not found');
      this.setCache(cacheKey, blog);
      return blog;
    })().finally(() => {
      this.inflight.delete(cacheKey);
    });

    this.inflight.set(cacheKey, fetchPromise);
    return fetchPromise;
  }

  async create(data: any) {
    this.clearCache();
    // Generate a simple slug from title if not provided
    const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    return this.prisma.blog.create({
      data: {
        ...data,
        slug,
        publishedAt: data.published ? new Date() : null,
      }
    });
  }

  async update(id: string, data: any) {
    this.clearCache();
    const blog = await this.prisma.blog.findUnique({ where: { id } });
    if (!blog) throw new NotFoundException('Blog post not found');

    if (data.published === true && !blog.published) {
      data.publishedAt = new Date();
    }

    return this.prisma.blog.update({
      where: { id },
      data
    });
  }
}

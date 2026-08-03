import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BlogsService {
  constructor(private prisma: PrismaService) {}

  async findAllPublished() {
    return this.prisma.blog.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
    });
  }

  async findAll() {
    // Admin only
    return this.prisma.blog.findMany({
      orderBy: { publishedAt: 'desc' },
    });
  }

  async findBySlug(slug: string) {
    const blog = await this.prisma.blog.findUnique({
      where: { slug }
    });
    if (!blog) throw new NotFoundException('Blog post not found');
    return blog;
  }

  async create(data: any) {
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

import { Test, TestingModule } from '@nestjs/testing';
import { BlogsService } from './blogs.service';
import { PrismaService } from '../prisma/prisma.service';
import { createMockPrismaService } from '../prisma/prisma.service.mock';
import { NotFoundException } from '@nestjs/common';

describe('BlogsService', () => {
  let service: BlogsService;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<BlogsService>(BlogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all published blogs', async () => {
    const blogs = [
      { id: 'blog-1', title: 'Almond Benefits', slug: 'almond-benefits', published: true, publishedAt: new Date() },
      { id: 'blog-2', title: 'Draft Post', slug: 'draft-post', published: false, publishedAt: null },
    ];
    prismaMock._seed('blogs', blogs);

    const result = await service.findAllPublished();
    expect(result.length).toBe(1);
    expect(result[0].slug).toBe('almond-benefits');
  });

  it('should throw NotFoundException for unknown slug', async () => {
    await expect(service.findBySlug('non-existent-slug')).rejects.toThrow(NotFoundException);
  });

  it('should create a blog post with auto-generated slug', async () => {
    const result = await service.create({ title: 'Best Almonds Guide', published: false });
    expect(result.slug).toBe('best-almonds-guide');
  });
});

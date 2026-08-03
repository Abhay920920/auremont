import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  async create(data: { name: string; email: string; subject: string; message: string }) {
    return this.prisma.contactMessage.create({
      data
    });
  }

  async findAll() {
    return this.prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateStatus(id: string, status: 'new' | 'resolved') {
    const msg = await this.prisma.contactMessage.findUnique({ where: { id } });
    if (!msg) throw new NotFoundException('Contact message not found');

    return this.prisma.contactMessage.update({
      where: { id },
      data: { status }
    });
  }
}

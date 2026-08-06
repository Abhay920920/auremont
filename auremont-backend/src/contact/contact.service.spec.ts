import { Test, TestingModule } from '@nestjs/testing';
import { ContactService } from './contact.service';
import { PrismaService } from '../prisma/prisma.service';
import { createMockPrismaService } from '../prisma/prisma.service.mock';
import { NotFoundException } from '@nestjs/common';

describe('ContactService', () => {
  let service: ContactService;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<ContactService>(ContactService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a contact message', async () => {
    const result = await service.create({
      name: 'Alexander Vance',
      email: 'alexander@auremont.com',
      subject: 'Order Query',
      message: 'When will my order arrive?',
    });
    expect(result.email).toBe('alexander@auremont.com');
    expect(result.subject).toBe('Order Query');
  });

  it('should return all contact messages', async () => {
    prismaMock._seed('contactMessages', [
      { id: 'msg-1', name: 'User A', email: 'a@a.com', subject: 'Test', message: 'Hi', createdAt: new Date() },
      { id: 'msg-2', name: 'User B', email: 'b@b.com', subject: 'Help', message: 'Hello', createdAt: new Date() },
    ]);
    const result = await service.findAll();
    expect(result.length).toBe(2);
  });

  it('should throw NotFoundException when updating status of non-existent message', async () => {
    await expect(service.updateStatus('non-existent-id', 'resolved')).rejects.toThrow(NotFoundException);
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { createMockPrismaService } from '../prisma/prisma.service.mock';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a notification', async () => {
    const result = await service.create('user-001', 'order_placed', 'Order Placed', 'Your order has been placed successfully.');
    expect(result).toBeDefined();
    expect(result.userId).toBe('user-001');
    expect(result.type).toBe('order_placed');
  });

  it('should return notifications for a user', async () => {
    prismaMock._seed('notifications', [
      { id: 'n-1', userId: 'user-001', type: 'order_placed', title: 'Order Placed', message: 'Done', createdAt: new Date() },
      { id: 'n-2', userId: 'user-002', type: 'order_cancelled', title: 'Cancelled', message: 'Oops', createdAt: new Date() },
    ]);

    const result = await service.findByUserId('user-001');
    expect(result.length).toBe(1);
    expect(result[0].userId).toBe('user-001');
  });
});

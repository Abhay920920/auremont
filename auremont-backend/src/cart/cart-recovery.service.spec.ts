import { Test, TestingModule } from '@nestjs/testing';
import { CartRecoveryService } from './cart-recovery.service';
import { PrismaService } from '../prisma/prisma.service';

describe('CartRecoveryService Unit Tests', () => {
  let service: CartRecoveryService;

  const mockCart = {
    id: 'cart-idle-1234',
    userId: 'user-1234',
    status: 'active',
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    user: { email: 'client@rarenuts.com', firstName: 'Alex', lastName: 'Vance' },
    items: [
      { quantity: 1, product: { name: 'Royal Almonds Wooden Box' } },
    ],
  };

  const mockPrismaService = {
    cart: {
      findMany: jest.fn(),
    },
    outboxEvent: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartRecoveryService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<CartRecoveryService>(CartRecoveryService);
    jest.clearAllMocks();
  });

  describe('processAbandonedCarts', () => {
    it('creates abandoned_cart_reminder outbox event for active carts idle for > 1h', async () => {
      mockPrismaService.cart.findMany.mockResolvedValue([mockCart]);
      mockPrismaService.outboxEvent.findFirst.mockResolvedValue(null); // No previous event
      mockPrismaService.outboxEvent.create.mockResolvedValue({ id: 'event-1' });

      const result = await service.processAbandonedCarts();

      expect(result.scanned).toBe(1);
      expect(result.recovered).toBe(1);
      expect(mockPrismaService.outboxEvent.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            eventType: 'abandoned_cart_reminder',
            payload: expect.objectContaining({
              cartId: 'cart-idle-1234',
              email: 'client@rarenuts.com',
            }),
          }),
        }),
      );
    });

    it('skips duplicate recovery email creation if an event already exists for cartId', async () => {
      mockPrismaService.cart.findMany.mockResolvedValue([mockCart]);
      mockPrismaService.outboxEvent.findFirst.mockResolvedValue({ id: 'existing-event' });

      const result = await service.processAbandonedCarts();

      expect(result.scanned).toBe(1);
      expect(result.recovered).toBe(0);
      expect(mockPrismaService.outboxEvent.create).not.toHaveBeenCalled();
    });
  });
});

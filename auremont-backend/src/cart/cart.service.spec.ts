/* jscpd:ignore-start */
/* eslint-disable no-plusplus */
import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { PrismaService } from '../prisma/prisma.service';
import { createMockPrismaService } from '../prisma/prisma.service.mock';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('CartService Unit Tests', () => {
  let cartService: CartService;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    cartService = module.get<CartService>(CartService);
  });

  describe('getCart', () => {
    it('should return null when no cartId and no userId provided', async () => {
      const result = await cartService.getCart(undefined, undefined);
      expect(result).toBeNull();
    });

    it('should throw ForbiddenException if user attempts to access another users cart', async () => {
      const cart = { id: 'cart-001', userId: 'user-A', status: 'active', items: [] };
      prismaMock._seed('carts', [cart]);

      // Override findFirst to return the cart with userId intact
      prismaMock.cart.findFirst = jest.fn().mockResolvedValue(cart);

      await expect(cartService.getCart('cart-001', 'user-B')).rejects.toThrow(ForbiddenException);
    });

    it('should return cart when user owns it', async () => {
      const cart = { id: 'cart-001', userId: 'user-A', status: 'active', items: [] };
      prismaMock.cart.findFirst = jest.fn().mockResolvedValue(cart);

      const result = await cartService.getCart('cart-001', 'user-A');
      expect(result).toBeDefined();
      expect(result?.id).toBe('cart-001');
    });
  });

  describe('addItemToCart', () => {
    it('should create new cart and add product item when no cartId provided', async () => {
      const product = { id: 'prod-001', name: 'Raw Almonds', price: '799.00', salePrice: null, sku: 'ALMOND-001' };
      prismaMock._seed('products', [product]);

      // findFirst for product lookup
      prismaMock.product.findFirst = jest.fn().mockResolvedValue(product);

      // getCart will return null initially (no cart exists)
      let callCount = 0;
      prismaMock.cart.findFirst = jest.fn().mockImplementation(() => {
        callCount += 1;
        // First call: returns null (no existing cart), subsequent calls return the created cart
        if (callCount === 1) return Promise.resolve(null);
        return Promise.resolve({ id: 'new-cart-001', userId: 'user-001', status: 'active', items: [] });
      });

      prismaMock.cartItem.findFirst = jest.fn().mockResolvedValue(null); // No existing item

      await cartService.addItemToCart({
        productId: 'ALMOND-001',
        quantity: 2,
        userId: 'user-001',
      });

      expect(prismaMock.cartItem.create).toHaveBeenCalled();
    });

    it('should update quantity if product already exists in cart', async () => {
      const product = { id: 'prod-001', price: '100.00', salePrice: null, sku: 'SKU-001' };
      const cart = { id: 'cart-001', userId: 'user-001', status: 'active', items: [] };
      const existingItem = {
        id: 'item-001',
        cartId: 'cart-001',
        productId: 'prod-001',
        quantity: 2,
        unitPrice: '100.00',
        subtotal: '200.00',
      };

      prismaMock.product.findFirst = jest.fn().mockResolvedValue(product);
      prismaMock.cart.findFirst = jest.fn().mockResolvedValue(cart);
      prismaMock.cartItem.findFirst = jest.fn().mockResolvedValue(existingItem);
      prismaMock.cartItem.update = jest.fn().mockResolvedValue({ ...existingItem, quantity: 5, subtotal: 500 });

      await cartService.addItemToCart({
        cartId: 'cart-001',
        productId: 'SKU-001',
        quantity: 3,
        userId: 'user-001',
      });

      // Should update, not create
      expect(prismaMock.cartItem.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'item-001' },
          data: { quantity: 5, subtotal: 500 },
        })
      );
    });
  });

  describe('updateItemQuantity', () => {
    it('should throw ForbiddenException if user updates item in another users cart', async () => {
      const cartOwner = { id: 'cart-owner-cart', userId: 'user-owner', status: 'active' };
      const item = {
        id: 'item-B',
        cartId: 'cart-owner-cart',
        productId: 'prod-1',
        quantity: 1,
        unitPrice: '100.00',
        cart: cartOwner,
      };

      prismaMock.cartItem.findUnique = jest.fn().mockResolvedValue(item);

      await expect(cartService.updateItemQuantity('item-B', 10, 'attacker-user')).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException if item does not exist', async () => {
      prismaMock.cartItem.findUnique = jest.fn().mockResolvedValue(null);
      await expect(cartService.updateItemQuantity('non-existent-item', 1, 'user-001')).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeItem', () => {
    it('should throw ForbiddenException if user removes item from another users cart', async () => {
      const cartOwner = { id: 'cart-owner-cart', userId: 'user-owner', status: 'active' };
      const item = {
        id: 'item-B',
        cartId: 'cart-owner-cart',
        productId: 'prod-1',
        quantity: 1,
        unitPrice: '100.00',
        cart: cartOwner,
      };

      prismaMock.cartItem.findUnique = jest.fn().mockResolvedValue(item);

      await expect(cartService.removeItem('item-B', 'attacker-user')).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException if item does not exist', async () => {
      prismaMock.cartItem.findUnique = jest.fn().mockResolvedValue(null);
      await expect(cartService.removeItem('ghost-item', 'user-001')).rejects.toThrow(NotFoundException);
    });
  });
});

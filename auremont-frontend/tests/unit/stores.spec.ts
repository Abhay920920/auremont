import { act } from '@testing-library/react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useCurrencyStore } from '@/store/currencyStore';
import { mockUser, mockCart } from '../mocks/mswHandlers';

describe('Zustand Stores Suite', () => {
  beforeEach(() => {
    act(() => {
      useAuthStore.getState().logout();
      useCartStore.getState().clearCart();
    });
  });

  describe('AuthStore', () => {
    it('should initialize with empty state', () => {
      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.refreshToken).toBeNull();
    });

    it('should set auth user and access token', () => {
      act(() => {
        useAuthStore.getState().setAuth(mockUser as any, 'access_token_123', 'refresh_token_456');
      });

      const state = useAuthStore.getState();
      expect(state.user?.email).toBe(mockUser.email);
      expect(state.token).toBe('access_token_123');
      expect(state.refreshToken).toBe('refresh_token_456');
    });

    it('should clear state on logout', () => {
      act(() => {
        useAuthStore.getState().setAuth(mockUser as any, 'access_token_123');
        useAuthStore.getState().logout();
      });

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
    });
  });

  describe('CartStore', () => {
    it('should initialize with empty cart state', () => {
      const state = useCartStore.getState();
      expect(state.cartId).toBeNull();
      expect(state.items).toEqual([]);
      expect(state.loading).toBe(false);
    });

    it('should fetch cart via MSW endpoint', async () => {
      await act(async () => {
        await useCartStore.getState().fetchCart();
      });

      const state = useCartStore.getState();
      expect(state.cartId).toBe(mockCart.id);
      expect(state.items.length).toBe(1);
      expect(state.items[0].productId).toBe(mockCart.items[0].productId);
    });

    it('should add item to cart', async () => {
      await act(async () => {
        await useCartStore.getState().addItem('prod-001-uuid', 2);
      });

      const state = useCartStore.getState();
      expect(state.cartId).toBe(mockCart.id);
      expect(state.items.length).toBeGreaterThan(0);
    });

    it('should clear cart state', () => {
      act(() => {
        useCartStore.getState().clearCart();
      });
      const state = useCartStore.getState();
      expect(state.cartId).toBeNull();
      expect(state.items).toEqual([]);
    });
  });

  describe('CurrencyStore', () => {
    it('should default to INR currency', () => {
      const state = useCurrencyStore.getState();
      expect(state.currency).toBe('INR');
    });

    it('should update active currency code', () => {
      act(() => {
        useCurrencyStore.getState().setCurrency('USD');
      });
      expect(useCurrencyStore.getState().currency).toBe('USD');
    });

    it('should format price string based on active currency', () => {
      act(() => {
        useCurrencyStore.getState().setCurrency('INR');
      });
      const formatted = useCurrencyStore.getState().formatPrice(1000);
      expect(formatted).toContain('1,000');
    });
  });
});

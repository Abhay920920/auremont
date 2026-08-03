import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/axios';

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: string;
  subtotal: string;
  product?: {
    name: string;
    thumbnailUrl: string;
    slug: string;
    price?: number;
    weightGrams?: number;
    stockQty?: number;
  };
}

interface CartState {
  cartId: string | null;
  items: CartItem[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchCart: () => Promise<void>;
  addItem: (productId: string, quantity: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => void;
  mergeCart: () => Promise<void>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartId: null,
      items: [],
      loading: false,
      error: null,

      fetchCart: async () => {
        const cartId = get().cartId;
        if (!cartId) return;

        set({ loading: true, error: null });
        try {
          const res = await api.get(`/cart?cartId=${cartId}`);
          if (res.data) {
            set({ cartId: res.data.id, items: res.data.items || [] });
          } else {
            set({ cartId: null, items: [] });
          }
        } catch (err) {
          set({ error: 'Failed to fetch cart' });
        } finally {
          set({ loading: false });
        }
      },

      addItem: async (productId: string, quantity: number) => {
        set({ loading: true, error: null });
        try {
          const res = await api.post('/cart/items', {
            cartId: get().cartId,
            productId,
            quantity,
          });
          // Backend returns the updated cart
          set({ cartId: res.data.id, items: res.data.items });
        } catch (err: any) {
          console.error("ADD ITEM ERROR:", err.response?.data || err);
          set({ error: 'Failed to add item' });
        } finally {
          set({ loading: false });
        }
      },

      updateQuantity: async (itemId: string, quantity: number) => {
        set({ loading: true, error: null });
        try {
          const res = await api.patch(`/cart/items/${itemId}`, { quantity });
          set({ items: res.data.items });
        } catch (err) {
          set({ error: 'Failed to update quantity' });
        } finally {
          set({ loading: false });
        }
      },

      removeItem: async (itemId: string) => {
        set({ loading: true, error: null });
        try {
          const res = await api.delete(`/cart/items/${itemId}`);
          set({ items: res.data.items });
        } catch (err) {
          set({ error: 'Failed to remove item' });
        } finally {
          set({ loading: false });
        }
      },

      clearCart: () => {
        set({ cartId: null, items: [] });
      },

      mergeCart: async () => {
        const guestCartId = get().cartId;
        if (!guestCartId) {
          // If no guest cart, just fetch the user's cart
          await get().fetchCart();
          return;
        }

        set({ loading: true, error: null });
        try {
          const res = await api.post('/cart/merge', { guestCartId });
          if (res.data) {
            set({ cartId: res.data.id, items: res.data.items || [] });
          } else {
            set({ cartId: null, items: [] });
          }
        } catch (err) {
          console.error("Merge cart failed", err);
          // Fallback to fetchCart if merge fails
          await get().fetchCart();
        } finally {
          set({ loading: false });
        }
      }
    }),
    {
      name: 'auremont-cart',
      partialize: (state) => ({ cartId: state.cartId }), // Only persist the cartId
    }
  )
);

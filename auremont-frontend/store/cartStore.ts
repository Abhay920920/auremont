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
  addItem: (productId: string, quantity: number, productDetails?: any) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => void;
  mergeCart: () => Promise<void>;
}

let inFlightFetch: Promise<void> | null = null;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartId: null,
      items: [],
      loading: false,
      error: null,

      fetchCart: async () => {
        if (inFlightFetch) {
          return inFlightFetch;
        }

        const { cartId } = get();
        set({ error: null });

        inFlightFetch = (async () => {
          try {
            const url = cartId ? `/cart?cartId=${cartId}` : '/cart';
            const res = await api.get(url);
            if (res.data) {
              set({ cartId: res.data.id, items: res.data.items || [] });
            } else {
              set({ cartId: null, items: [] });
            }
          } catch (err) {
            set({ error: 'Failed to fetch cart' });
          } finally {
            inFlightFetch = null;
          }
        })();

        return inFlightFetch;
      },

      addItem: async (productId: string, quantity: number, productDetails?: any) => {
        const prevItems = get().items || [];
        
        // Optimistic Item Creation: update local UI in 0ms
        const existingIndex = prevItems.findIndex(i => i.productId === productId || i.product?.slug === productId);
        let optimisticItems: CartItem[];

        if (existingIndex > -1) {
          const item = prevItems[existingIndex];
          const newQty = item.quantity + quantity;
          optimisticItems = [
            ...prevItems.slice(0, existingIndex),
            { ...item, quantity: newQty, subtotal: (Number(item.unitPrice) * newQty).toString() },
            ...prevItems.slice(existingIndex + 1),
          ];
        } else if (productDetails) {
          const unitPrice = (productDetails.salePrice || productDetails.price || 0).toString();
          const tempItem: CartItem = {
            id: `temp-${Date.now()}`,
            productId,
            quantity,
            unitPrice,
            subtotal: (Number(unitPrice) * quantity).toString(),
            product: {
              name: productDetails.name || 'Botanical Creation',
              thumbnailUrl: productDetails.thumbnailUrl || '/images/california-almonds-250g.png',
              slug: productDetails.slug || '',
              price: Number(productDetails.price || 0),
              weightGrams: productDetails.weightGrams || 250,
              stockQty: productDetails.stockQty || 10,
            },
          };
          optimisticItems = [...prevItems, tempItem];
        } else {
          optimisticItems = prevItems;
        }

        if (optimisticItems !== prevItems) {
          set({ items: optimisticItems, error: null });
        }

        try {
          const res = await api.post('/cart/items', {
            cartId: get().cartId,
            productId,
            quantity,
          });
          if (res.data) {
            set({ cartId: res.data.id, items: res.data.items || [] });
          }
        } catch (err: any) {
          console.error("ADD ITEM ERROR:", err.response?.data || err);
          // Rollback on server failure
          set({ items: prevItems, error: 'Failed to add item to cart' });
          throw err;
        }
      },

      updateQuantity: async (itemId: string, quantity: number) => {
        const prevItems = get().items;
        // Optimistic UI update for immediate 0ms response
        const nextItems = prevItems.map((item) =>
          item.id === itemId
            ? { ...item, quantity, subtotal: (Number(item.unitPrice) * quantity).toString() }
            : item
        );
        set({ items: nextItems, error: null });

        try {
          const res = await api.patch(`/cart/items/${itemId}`, { quantity }, {
            params: { cartId: get().cartId }
          });
          if (res.data?.items) {
            set({ items: res.data.items });
          }
        } catch (err) {
          // Rollback on server failure
          set({ items: prevItems, error: 'Failed to update quantity' });
        }
      },

      removeItem: async (itemId: string) => {
        const prevItems = get().items;
        // Optimistic UI update for immediate 0ms response
        const nextItems = prevItems.filter((item) => item.id !== itemId);
        set({ items: nextItems, error: null });

        try {
          const res = await api.delete(`/cart/items/${itemId}`, {
            params: { cartId: get().cartId }
          });
          if (res.data?.items) {
            set({ items: res.data.items });
          }
        } catch (err) {
          // Rollback on server failure
          set({ items: prevItems, error: 'Failed to remove item' });
        }
      },

      clearCart: () => {
        if (typeof window !== 'undefined') {
          try {
            localStorage.removeItem('rarenuts-cart');
          } catch {
            // Ignore storage access errors
          }
        }
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
      name: 'rarenuts-cart',
      partialize: (state) => ({ cartId: state.cartId, items: state.items }), // Persist cartId and items
    }
  )
);

import { create } from 'zustand';
import api from '@/lib/axios';
import { useAuthStore } from './authStore';

export interface WishlistItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: string | number;
    thumbnailUrl: string;
  };
}

interface WishlistState {
  items: WishlistItem[];
  loading: boolean;
  error: string | null;
  fetchWishlist: (userId: string) => Promise<void>;
  addWishlist: (userId: string, productId: string) => Promise<void>;
  removeWishlist: (userId: string, productId: string) => Promise<void>;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  loading: false,
  error: null,

  fetchWishlist: async (userId: string) => {
    const { token } = useAuthStore.getState();
    if (!userId || !token) {
      set({ items: [] });
      return;
    }
    set({ loading: true, error: null });
    try {
      const res = await api.get(`/wishlists`);
      set({ items: res.data || [] });
    } catch (err: any) {
      if (err?.response?.status === 401) {
        set({ items: [] });
      } else {
        console.error("Failed to fetch wishlist", err);
        set({ error: 'Failed to load wishlist' });
      }
    } finally {
      set({ loading: false });
    }
  },

  addWishlist: async (userId: string, productId: string) => {
    set({ loading: true, error: null });
    try {
      await api.post('/wishlists', { productId });
      await get().fetchWishlist(userId);
    } catch (err: any) {
      console.error("Failed to add to wishlist", err);
      set({ error: 'Failed to add to wishlist' });
    } finally {
      set({ loading: false });
    }
  },

  removeWishlist: async (userId: string, productId: string) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/wishlists/${productId}`);
      await get().fetchWishlist(userId);
    } catch (err: any) {
      console.error("Failed to remove from wishlist", err);
      set({ error: 'Failed to remove from wishlist' });
    } finally {
      set({ loading: false });
    }
  },

  clearWishlist: () => set({ items: [] }),
}));

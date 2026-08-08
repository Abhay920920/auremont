"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      setAuth(response.data.user, response.data.access_token, response.data.refresh_token);
      
      // Trigger cart merge and fetch wishlist (do not await so it doesn't block routing)
      import('@/store/cartStore').then(({ useCartStore }) => {
        useCartStore.getState().mergeCart();
        return null;
      }).catch(console.error);
      import('@/store/wishlistStore').then(({ useWishlistStore }) => {
        useWishlistStore.getState().fetchWishlist(response.data.user.id);
        return null;
      }).catch(console.error);

      if (response.data.user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/account'); // Or redirect back to previous page
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 pt-36 pb-16">
      <div className="w-full max-w-md card space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-serif text-luxuryGold">Welcome Back</h1>
          <p className="text-mutedText">Log in to your RARE NUTS account</p>
        </div>

        {error && (
          <div className="p-4 rounded-md bg-error/10 border border-error text-error text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-secondaryText">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 px-4 rounded-input bg-background border border-divider focus:border-luxuryGold focus:outline-none transition-colors"
              required
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
               <label className="text-sm font-medium text-secondaryText">Password</label>
               <a href="/forgot-password" className="text-xs text-luxuryGold hover:underline">Forgot password?</a>
            </div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 px-4 rounded-input bg-background border border-divider focus:border-luxuryGold focus:outline-none transition-colors"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-primary"
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center text-sm text-mutedText">
          Don't have an account? <a href="/register" className="text-luxuryGold hover:underline">Create one</a>
        </div>
      </div>
    </div>
  );
}

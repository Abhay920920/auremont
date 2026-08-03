"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Register User
      await api.post('/auth/register', formData);
      
      // 2. Auto Login after registration
      const loginRes = await api.post('/auth/login', { 
        email: formData.email, 
        password: formData.password 
      });
      
      setAuth(loginRes.data.user, loginRes.data.access_token);
      router.push('/account');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md card space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-serif text-luxuryGold">Join AUREMONT</h1>
          <p className="text-mutedText">Create your exclusive account</p>
        </div>

        {error && (
          <div className="p-4 rounded-md bg-error/10 border border-error text-error text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-secondaryText">First Name</label>
              <input 
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full h-12 px-4 rounded-input bg-background border border-divider focus:border-luxuryGold focus:outline-none transition-colors"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-secondaryText">Last Name</label>
              <input 
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full h-12 px-4 rounded-input bg-background border border-divider focus:border-luxuryGold focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-secondaryText">Email Address</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full h-12 px-4 rounded-input bg-background border border-divider focus:border-luxuryGold focus:outline-none transition-colors"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-secondaryText">Password</label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full h-12 px-4 rounded-input bg-background border border-divider focus:border-luxuryGold focus:outline-none transition-colors"
              required
              minLength={6}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-primary"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="text-center text-sm text-mutedText">
          Already have an account? <a href="/login" className="text-luxuryGold hover:underline">Sign In</a>
        </div>
      </div>
    </div>
  );
}

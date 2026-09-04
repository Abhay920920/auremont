import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { useWishlistStore } from '../store/wishlistStore';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 15000,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token?: string | null) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any = null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

import { isTokenExpired } from './jwt';

let refreshPromise: Promise<string | null> | null = null;

export async function getValidAccessToken(): Promise<string | null> {
  const { token, refreshToken } = useAuthStore.getState();
  if (!token) return null;

  if (!isTokenExpired(token)) {
    return token;
  }

  // Token is expired. If refresh token is also missing or expired, log out cleanly
  if (!refreshToken || isTokenExpired(refreshToken)) {
    useAuthStore.getState().logout();
    useWishlistStore.getState().clearWishlist();
    return null;
  }

  // Deduplicate concurrent token refreshes
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const res = await axios.post(
        `${baseURL}/auth/refresh`,
        { refreshToken },
        { withCredentials: true }
      );
      const { access_token, refresh_token: new_refresh_token } = res.data;
      
      useAuthStore.getState().setToken(access_token);
      if (new_refresh_token) {
        useAuthStore.getState().setRefreshToken(new_refresh_token);
      }
      return access_token;
    } catch (err) {
      useAuthStore.getState().logout();
      useWishlistStore.getState().clearWishlist();
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

api.interceptors.request.use(async (config) => {
  const isAuthRequest = 
    config.url?.includes('/auth/login') || 
    config.url?.includes('/auth/refresh') ||
    config.url?.includes('/auth/register');

  if (!isAuthRequest) {
    const validToken = await getValidAccessToken();
    if (validToken && config.headers) {
      config.headers.Authorization = `Bearer ${validToken}`;
    } else if (config.url?.includes('/notifications') || config.url?.includes('/wishlists')) {
      // Abort requests to user-specific endpoints if unauthenticated or session expired to prevent 401 errors in console
      const controller = new AbortController();
      controller.abort('Authentication required');
      config.signal = controller.signal;
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest || !error.response) {
      return Promise.reject(error);
    }

    const isAuthRequest = 
      originalRequest.url?.includes('/auth/login') || 
      originalRequest.url?.includes('/auth/refresh') ||
      originalRequest.url?.includes('/auth/register');

    if (error.response.status === 401 && !originalRequest._retry && !isAuthRequest) {
      if (isRefreshing) {
        try {
          const token = await new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
          if (originalRequest.headers && token) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return await api(originalRequest);
        } catch (err) {
          throw err;
        }
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const currentRefreshToken = useAuthStore.getState().refreshToken;
        if (!currentRefreshToken) {
          useAuthStore.getState().logout();
          useWishlistStore.getState().clearWishlist();
          return Promise.reject(error);
        }
        const res = await axios.post(
          `${baseURL}/auth/refresh`,
          { refreshToken: currentRefreshToken },
          { withCredentials: true }
        );
        const { access_token, refresh_token: new_refresh_token } = res.data;
        
        useAuthStore.getState().setToken(access_token);
        if (new_refresh_token) {
          useAuthStore.getState().setRefreshToken(new_refresh_token);
        }
        
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
        }
        
        processQueue(null, access_token);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.getState().logout();
        useWishlistStore.getState().clearWishlist();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;

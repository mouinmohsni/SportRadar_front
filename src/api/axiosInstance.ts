// src/api/axiosInstance.ts
import axios from 'axios';
import { refreshAccessToken } from '../utils/auth';

const PUBLIC_ENDPOINTS = [
  '/users/register/',           // ← Ajout du préfixe /users/
  '/users/token/',              // ← Ajout du préfixe /users/
  '/users/token/refresh/',      // ← Ajout du préfixe /users/
  '/weather/',
  '/places/',
  '/activities/',
];

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
});


// Request interceptor
axiosInstance.interceptors.request.use(async (config) => {
  const url = config.url || '';
  // Si l'URL commence par l'un des endpoints publics, on skippe le token
  const isPublic = PUBLIC_ENDPOINTS.some(ep => url.startsWith(ep));
  if (!isPublic) {
    const token = localStorage.getItem('access');
    if (token) {
      (config.headers as any)['Authorization'] = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor pour rafraîchir automatiquement le token si 401
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    // Si 401 et qu'on n'a pas déjà retry, et qu'on a un refresh token
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem('refresh')
    ) {
      originalRequest._retry = true;
      const newAccess = await refreshAccessToken();
      if (newAccess) {
        // Mettre à jour le header pour retry
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return axiosInstance(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

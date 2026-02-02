// src/api/axiosInstance.ts
import axios from 'axios';
import { refreshAccessToken } from '../utils/auth';

const PUBLIC_ENDPOINTS = [
  'api/users/register/',           // ← Ajout du préfixe /users/
  'api/users/token/',              // ← Ajout du préfixe /users/
  'api/users/token/refresh/',      // ← Ajout du préfixe /users/
  'api/weather/',
  'api/places/',
  'api/activities/',
];


const baseURL = import.meta.env.VITE_API_URL;
if (!baseURL) {
  // En développement, on peut utiliser une valeur par défaut.
  // En production, cette erreur arrêtera le build si la variable manque, ce qui est une bonne chose.
  console.error("VITE_API_URL is not defined!");
}
const axiosInstance = axios.create({
  baseURL: baseURL || 'http://localhost:8000', // Garder un fallback simple pour le dev
  headers: { 'Content-Type': 'application/json' },
} );




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

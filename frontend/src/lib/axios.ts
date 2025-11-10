import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';

/**
 * Instancia de Axios configurada con interceptores
 * ISO 25010: Fiabilidad, Seguridad
 */

// Obtener API_URL - en Next.js, NEXT_PUBLIC_* se inyecta en build time
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// Validación en producción
if (typeof window !== 'undefined' && API_URL.includes('localhost') && window.location.hostname !== 'localhost') {
  console.error('❌ ERROR: NEXT_PUBLIC_API_URL no está configurada correctamente');
}

export const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de request para agregar el token JWT
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const session = await getSession();
      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      }
    } catch (error) {
      // Continuar sin token - el backend rechazará si es necesario
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de response para manejar errores globalmente
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado - cerrar sesión
      await signOut({ redirect: true, callbackUrl: '/landing' });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;


import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';

/**
 * Instancia de Axios configurada con interceptores
 * ISO 25010: Fiabilidad, Seguridad
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

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
    const session = await getSession();
    
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de response para manejar errores globalmente
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado - cerrar sesión
      await signOut({ redirect: true, callbackUrl: '/login' });
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;


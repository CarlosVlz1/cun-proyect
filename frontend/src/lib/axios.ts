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
    try {
      const session = await getSession();
      
      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
        console.log('✅ Token agregado a request:', config.url);
      } else {
        console.warn('⚠️  No hay token en la sesión para:', config.url);
      }
    } catch (error) {
      console.error('❌ Error obteniendo sesión en interceptor:', error);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Error en interceptor de request:', error);
    return Promise.reject(error);
  }
);

// Interceptor de response para manejar errores globalmente
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('✅ Response exitosa:', response.config.url, response.status);
    return response;
  },
  async (error) => {
    console.error('❌ Error en response:', {
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
    });
    
    if (error.response?.status === 401) {
      console.error('🔒 Error 401 - Token inválido o expirado');
      // Token inválido o expirado - cerrar sesión
      await signOut({ redirect: true, callbackUrl: '/landing' });
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;


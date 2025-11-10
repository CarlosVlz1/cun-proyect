import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';

/**
 * Instancia de Axios configurada con interceptores
 * ISO 25010: Fiabilidad, Seguridad
 */

// Obtener API_URL - en Next.js, NEXT_PUBLIC_* se inyecta en build time
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// Validación y logging
if (typeof window !== 'undefined') {
  console.log('🔗 API_URL configurada:', API_URL);
  console.log('🔗 NEXT_PUBLIC_API_URL desde env:', process.env.NEXT_PUBLIC_API_URL || 'NO CONFIGURADA');
  
  // Advertencia si está usando localhost en producción
  if (API_URL.includes('localhost') && window.location.hostname !== 'localhost') {
    console.error('❌ ERROR: NEXT_PUBLIC_API_URL no está configurada correctamente');
    console.error('❌ Se está usando localhost en producción:', API_URL);
    console.error('❌ Configura NEXT_PUBLIC_API_URL en Railway → Frontend → Variables');
  }
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
      const fullUrl = `${config.baseURL}${config.url}`;
      console.log('📤 Request:', config.method?.toUpperCase(), fullUrl);
      
      // Intentar obtener la sesión, pero no bloquear si falla
      try {
        const session = await getSession();
        
        if (session?.accessToken) {
          config.headers.Authorization = `Bearer ${session.accessToken}`;
          console.log('✅ Token agregado a request:', config.url);
        } else {
          console.warn('⚠️  No hay token en la sesión para:', config.url);
          // No bloquear la petición, solo advertir
        }
      } catch (sessionError) {
        console.warn('⚠️  Error obteniendo sesión (continuando sin token):', sessionError);
        // Continuar sin token - el backend rechazará si es necesario
      }
    } catch (error) {
      console.error('❌ Error en interceptor de request:', error);
      // No rechazar la petición, dejar que continúe
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
    // Detectar Network Error específicamente
    if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
      const attemptedUrl = error.config ? `${error.config.baseURL}${error.config.url}` : 'URL desconocida';
      console.error('❌ NETWORK ERROR - La petición no llegó al servidor');
      console.error('📤 URL intentada:', attemptedUrl);
      console.error('🔗 API_URL configurada:', API_URL);
      console.error('💡 Posibles causas:');
      console.error('   1. NEXT_PUBLIC_API_URL no está configurada en Railway');
      console.error('   2. La URL del backend es incorrecta');
      console.error('   3. Problema de CORS');
      console.error('   4. El backend no está respondiendo');
    }
    
    console.error('❌ Error en response:', {
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      fullURL: error.config ? `${error.config.baseURL}${error.config.url}` : 'N/A',
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      code: error.code,
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


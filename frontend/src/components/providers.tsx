'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { useState } from 'react';
import { MUIProviders } from './MUIProviders';

/**
 * Proveedores globales de la aplicación
 * ISO 25010: Mantenibilidad, Usabilidad
 */

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minuto
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <MUIProviders>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#ffffff',
                  color: '#0f172a',
                  border: '1.5px solid rgba(15, 23, 42, 0.16)',
                  borderRadius: '10px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06)',
                  padding: '16px',
                  fontSize: '14px',
                  fontWeight: 500,
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
                },
                success: {
                  style: {
                    background: '#ffffff',
                    color: '#0f172a',
                    border: '1.5px solid #10b981',
                    borderRadius: '10px',
                    boxShadow: '0 4px 6px rgba(16, 185, 129, 0.15), 0 2px 4px rgba(16, 185, 129, 0.1)',
                  },
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#ffffff',
                  },
                },
                error: {
                  style: {
                    background: '#ffffff',
                    color: '#0f172a',
                    border: '1.5px solid #ef4444',
                    borderRadius: '10px',
                    boxShadow: '0 4px 6px rgba(239, 68, 68, 0.15), 0 2px 4px rgba(239, 68, 68, 0.1)',
                  },
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#ffffff',
                  },
                },
              }}
            />
          </ThemeProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </MUIProviders>
      </QueryClientProvider>
    </SessionProvider>
  );
}


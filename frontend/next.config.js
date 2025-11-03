/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
  },
  typescript: {
    // Solo para desarrollo - en producción debe estar en false
    ignoreBuildErrors: false,
  },
  eslint: {
    // Solo para desarrollo - en producción debe estar en false
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;


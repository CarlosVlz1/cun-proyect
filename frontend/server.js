#!/usr/bin/env node
// Script para iniciar Next.js con el puerto correcto en Railway
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

// Railway asigna el puerto automáticamente
const port = parseInt(process.env.PORT || '3000', 10);
const hostname = '0.0.0.0';

console.log(`[Server] Initializing Next.js...`);
console.log(`[Server] Port: ${port}`);
console.log(`[Server] Hostname: ${hostname}`);
console.log(`[Server] NODE_ENV: ${process.env.NODE_ENV || 'development'}`);

// Inicializar Next.js en modo producción
const app = next({ 
  dev: false,
  hostname,
  port 
});

const handle = app.getRequestHandler();

// Preparar la aplicación y luego iniciar el servidor
app.prepare()
  .then(() => {
    console.log(`[Server] Next.js app prepared successfully`);
    
    const server = createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error('[Server] Error handling request:', err);
        res.statusCode = 500;
        res.end('Internal server error');
      }
    });

    server.listen(port, hostname, (err) => {
      if (err) {
        console.error('[Server] Failed to start:', err);
        process.exit(1);
      }
      console.log(`[Server] ✅ Ready on http://${hostname}:${port}`);
      console.log(`[Server] ✅ Server is listening for requests`);
    });

    // Manejar errores del servidor
    server.on('error', (err) => {
      console.error('[Server] Server error:', err);
      process.exit(1);
    });
  })
  .catch((err) => {
    console.error('[Server] Failed to prepare Next.js app:', err);
    console.error('[Server] Error details:', err.stack);
    process.exit(1);
  });


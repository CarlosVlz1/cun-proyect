# Tests del Frontend

Este directorio contiene las pruebas unitarias del frontend.

## Estructura

Los tests están organizados siguiendo la misma estructura del código fuente:

- `services/api/__tests__/` - Tests para servicios de API
- `services/api/__fixtures__/` - Fixtures y mocks para servicios
- `lib/__tests__/` - Tests para utilidades
- `lib/__fixtures__/` - Fixtures para utilidades
- `components/ui/__tests__/` - Tests para componentes UI

## Ejecutar Tests

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con cobertura
npm run test:cov
```

## Cobertura

Los tests están configurados para alcanzar 100% de cobertura en:
- Servicios de API (auth, tasks, users, statistics, backup)
- Utilidades (utils.ts, axios.ts)
- Componentes UI (Button, Input)

## Notas

- Los tests usan Jest con jsdom para simular el entorno del navegador
- Se utilizan mocks para `next-auth/react` y `next/navigation`
- Los fixtures están en carpetas `__fixtures__` separadas para reutilización


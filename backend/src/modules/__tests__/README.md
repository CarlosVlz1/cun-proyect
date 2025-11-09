# Pruebas Unitarias

Este directorio contiene las pruebas unitarias del proyecto, organizadas por módulos.

## Estructura

Cada módulo tiene su propia carpeta `__tests__` y `__fixtures__`:

```
modules/
├── auth/
│   ├── __tests__/
│   │   └── auth.service.spec.ts
│   └── __fixtures__/
│       └── user.fixture.ts
├── users/
│   ├── __tests__/
│   │   └── users.service.spec.ts
│   └── __fixtures__/
│       └── user.fixture.ts
└── tasks/
    ├── __tests__/
    │   └── tasks.service.spec.ts
    └── __fixtures__/
        └── task.fixture.ts
```

## Ejecutar Pruebas

### Todas las pruebas
```bash
npm test
```

### Pruebas en modo watch
```bash
npm run test:watch
```

### Pruebas con cobertura
```bash
npm run test:cov
```

### Pruebas de un módulo específico
```bash
npm test -- auth
npm test -- users
npm test -- tasks
```

## Fixtures

Los archivos en `__fixtures__` contienen datos de prueba reutilizables (mocks, datos de ejemplo) que se usan en múltiples tests para mantener consistencia y evitar duplicación.

## Convenciones

- Los archivos de prueba terminan en `.spec.ts`
- Cada servicio tiene su archivo de prueba correspondiente
- Los fixtures se organizan por entidad (user, task, etc.)
- Los mocks se crean usando `jest.fn()` y `jest.mock()`


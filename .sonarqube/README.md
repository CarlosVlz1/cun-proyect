# Configuración de SonarQube

Este proyecto está configurado para usar SonarQube para análisis de calidad de código.

## Requisitos Previos

1. **SonarQube Server**: Necesitas tener un servidor SonarQube ejecutándose. Opciones:
   - SonarQube Cloud (gratis para proyectos open source)
   - SonarQube Community Edition (local)
   - SonarCloud (recomendado para proyectos en GitHub)

2. **SonarScanner**: Herramienta CLI para ejecutar análisis
   ```bash
   npm install -g sonarqube-scanner
   ```

## Configuración Inicial

### Opción 1: SonarCloud (Recomendado)

1. Ve a [SonarCloud](https://sonarcloud.io/) y crea una cuenta
2. Conecta tu repositorio de GitHub
3. Crea un nuevo proyecto
4. Obtén el token de autenticación desde tu perfil
5. Configura las variables de entorno:

```bash
export SONAR_TOKEN=tu_token_aqui
export SONAR_ORGANIZATION=tu_organizacion
```

### Opción 2: SonarQube Local

1. Descarga e instala SonarQube Community Edition
2. Inicia el servidor (por defecto en http://localhost:9000)
3. Crea un proyecto en SonarQube
4. Obtén el token desde: Administration > Security > Users > Tokens
5. Configura las variables de entorno:

```bash
export SONAR_HOST_URL=http://localhost:9000
export SONAR_TOKEN=tu_token_aqui
```

## Ejecutar Análisis

### Análisis Local

```bash
# Instalar dependencias de análisis
npm install --save-dev sonarqube-scanner

# Ejecutar análisis
npm run sonar
```

### Análisis con Docker

```bash
docker run --rm \
  -v $(pwd):/usr/src \
  -w /usr/src \
  sonarsource/sonar-scanner-cli \
  -Dsonar.projectKey=sistema-gestion-tareas-fullstack \
  -Dsonar.sources=backend/src,frontend/src \
  -Dsonar.host.url=$SONAR_HOST_URL \
  -Dsonar.login=$SONAR_TOKEN
```

## Configuración en CI/CD

### GitHub Actions

Crea `.github/workflows/sonar.yml`:

```yaml
name: SonarQube Analysis

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  sonar:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: |
          npm install
          cd backend && npm install
          cd ../frontend && npm install
      
      - name: Run tests with coverage
        run: |
          cd backend && npm run test:cov
          cd ../frontend && npm run test:cov
      
      - name: SonarQube Scan
        uses: sonarsource/sonarqube-scan-action@master
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
          SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL }}
```

## Variables de Entorno

Agrega estas variables a tu `.env` o configuración de CI/CD:

```bash
# SonarQube Configuration
SONAR_HOST_URL=https://sonarcloud.io  # o tu URL de SonarQube
SONAR_TOKEN=tu_token_de_autenticacion
SONAR_ORGANIZATION=tu_organizacion  # Solo para SonarCloud
SONAR_PROJECT_KEY=sistema-gestion-tareas-fullstack
```

## Estructura del Proyecto

El análisis incluye:
- **Backend**: `backend/src/**/*.ts` (NestJS)
- **Frontend**: `frontend/src/**/*.{ts,tsx}` (Next.js)

Excluye:
- `node_modules/`
- `dist/`, `build/`, `.next/`
- Archivos de prueba (`*.spec.ts`, `*.test.ts`)
- Archivos generados (`*.d.ts`, `*.js.map`)
- DTOs, interfaces, módulos

## Métricas Analizadas

SonarQube analiza:
- ✅ Bugs y vulnerabilidades
- ✅ Code smells
- ✅ Cobertura de código
- ✅ Duplicación de código
- ✅ Complejidad ciclomática
- ✅ Mantenibilidad
- ✅ Seguridad
- ✅ Confiabilidad

## Solución de Problemas

### Error: "Unable to get metadata"
- Verifica que `SONAR_TOKEN` esté configurado correctamente
- Verifica que `SONAR_HOST_URL` sea accesible

### Error: "No files to analyze"
- Verifica que las rutas en `sonar.sources` sean correctas
- Verifica que los archivos no estén en `sonar.exclusions`

### Cobertura no aparece
- Asegúrate de ejecutar `npm run test:cov` antes del análisis
- Verifica que los archivos `lcov.info` se generen en `backend/coverage/` y `frontend/coverage/`

## Recursos

- [Documentación de SonarQube](https://docs.sonarqube.org/)
- [SonarCloud](https://sonarcloud.io/)
- [SonarScanner](https://docs.sonarqube.org/latest/analysis/scan/sonarscanner/)


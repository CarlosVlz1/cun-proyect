# Configuración de SonarQube - Guía Rápida

## 🚀 Inicio Rápido

### 1. Instalar Dependencias

```bash
npm install
```

Esto instalará `sonarqube-scanner` como dependencia de desarrollo.

### 2. Configurar SonarCloud (Recomendado)

#### Opción A: SonarCloud (Gratis para proyectos open source)

1. Ve a [SonarCloud.io](https://sonarcloud.io/) y crea una cuenta
2. Conecta tu repositorio de GitHub
3. Crea un nuevo proyecto
4. Obtén el token desde: **My Account > Security > Generate Token**
5. Agrega los secrets en GitHub:
   - Ve a tu repositorio → Settings → Secrets and variables → Actions
   - Agrega:
     - `SONAR_TOKEN`: Tu token de SonarCloud
     - `SONAR_HOST_URL`: `https://sonarcloud.io`
     - `SONAR_ORGANIZATION`: Tu organización en SonarCloud

#### Opción B: SonarQube Local

1. Descarga [SonarQube Community Edition](https://www.sonarqube.org/downloads/)
2. Inicia el servidor (por defecto: http://localhost:9000)
3. Login con usuario: `admin` / password: `admin`
4. Crea un proyecto manualmente
5. Genera un token: **Administration > Security > Users > Tokens**
6. Configura variables de entorno localmente:

```bash
export SONAR_HOST_URL=http://localhost:9000
export SONAR_TOKEN=tu_token_aqui
```

### 3. Ejecutar Análisis

#### Análisis Local

```bash
# Con SonarCloud
npm run sonar:cloud

# Con SonarQube local
npm run sonar:local

# O usando la variable de entorno
npm run sonar
```

#### Análisis con Cobertura

```bash
# 1. Generar cobertura de tests
npm run test:cov

# 2. Ejecutar análisis
npm run sonar
```

### 4. Ver Resultados

- **SonarCloud**: Ve a tu proyecto en [sonarcloud.io](https://sonarcloud.io)
- **SonarQube Local**: Ve a http://localhost:9000

## 📋 Configuración Actual

El proyecto está configurado para analizar:

- ✅ **Backend**: `backend/src/**/*.ts` (NestJS)
- ✅ **Frontend**: `frontend/src/**/*.{ts,tsx}` (Next.js)
- ✅ **Tests**: Archivos de prueba incluidos
- ✅ **Cobertura**: Reportes de `coverage/lcov.info`

### Archivos Excluidos

- `node_modules/`
- `dist/`, `build/`, `.next/`
- Archivos de prueba (`*.spec.ts`, `*.test.ts`)
- Archivos generados (`*.d.ts`, `*.js.map`)
- DTOs, interfaces, módulos

## 🔧 Variables de Entorno

Crea un archivo `.env.local` o configura estas variables:

```bash
# SonarQube Configuration
SONAR_HOST_URL=https://sonarcloud.io  # o http://localhost:9000
SONAR_TOKEN=tu_token_de_autenticacion
SONAR_ORGANIZATION=tu_organizacion  # Solo para SonarCloud
SONAR_PROJECT_KEY=sistema-gestion-tareas-fullstack
```

## 📊 Métricas Analizadas

SonarQube analiza:

- 🐛 **Bugs**: Errores en el código
- 🔒 **Vulnerabilidades**: Problemas de seguridad
- 💡 **Code Smells**: Problemas de mantenibilidad
- 📈 **Cobertura**: Porcentaje de código cubierto por tests
- 🔄 **Duplicación**: Código duplicado
- 📊 **Complejidad**: Complejidad ciclomática
- ⚡ **Performance**: Problemas de rendimiento

## 🎯 Quality Gates

El proyecto usa el Quality Gate por defecto de SonarQube que verifica:

- ✅ No hay bugs nuevos
- ✅ No hay vulnerabilidades críticas
- ✅ Cobertura de código > 80% (configurable)
- ✅ Duplicación < 3%
- ✅ Mantenibilidad A

## 🔄 CI/CD Integration

El workflow de GitHub Actions (`.github/workflows/sonar.yml`) ejecuta automáticamente:

- En cada push a `main`, `develop`, `master`
- En cada Pull Request
- Manualmente desde GitHub Actions

## 🐛 Solución de Problemas

### Error: "Unable to get metadata"
```bash
# Verifica que el token sea correcto
echo $SONAR_TOKEN

# Verifica que la URL sea accesible
curl $SONAR_HOST_URL/api/system/status
```

### Error: "No files to analyze"
- Verifica que los archivos no estén en `.gitignore`
- Verifica las rutas en `sonar-project.properties`

### Cobertura no aparece
```bash
# Asegúrate de generar los reportes de cobertura primero
npm run test:cov

# Verifica que existan los archivos
ls backend/coverage/lcov.info
ls frontend/coverage/lcov.info
```

### Error de permisos
```bash
# Asegúrate de tener permisos en el proyecto de SonarQube
# Verifica el token en SonarCloud/SonarQube
```

## 📚 Recursos Adicionales

- [Documentación SonarQube](https://docs.sonarqube.org/)
- [SonarCloud](https://sonarcloud.io/)
- [SonarScanner CLI](https://docs.sonarqube.org/latest/analysis/scan/sonarscanner/)
- [Quality Gates](https://docs.sonarqube.org/latest/user-guide/quality-gates/)

## ✅ Checklist de Configuración

- [ ] Instalar dependencias: `npm install`
- [ ] Crear cuenta en SonarCloud o instalar SonarQube local
- [ ] Crear proyecto en SonarQube
- [ ] Generar token de autenticación
- [ ] Configurar variables de entorno o secrets de GitHub
- [ ] Ejecutar tests con cobertura: `npm run test:cov`
- [ ] Ejecutar análisis: `npm run sonar`
- [ ] Verificar resultados en SonarQube/SonarCloud

## 🎉 ¡Listo!

Una vez configurado, SonarQube analizará automáticamente tu código en cada push y PR.


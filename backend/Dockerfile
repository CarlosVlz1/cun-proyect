FROM node:20-alpine

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar código fuente
COPY . .

# Exponer puerto
EXPOSE 4000

# Comando por defecto (puede ser sobreescrito por docker-compose)
CMD ["npm", "run", "start:dev"]


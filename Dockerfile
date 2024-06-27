# Usar la imagen oficial de Node.js como imagen base
FROM node:18-bullseye as bot

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código de la aplicación
COPY . .

# Exponer el puerto en el que se ejecutará la aplicación
EXPOSE 3000

# Iniciar la aplicación
CMD ["npm", "start"]

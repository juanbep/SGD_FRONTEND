# Usamos una imagen base de Node.js (versión 22 en su variante ligera "alpine") para construir la aplicación Angular.
FROM node:22-alpine AS build-step

# Creamos un directorio llamado /app dentro del contenedor.
RUN mkdir -p /app

# Establecemos el directorio de trabajo en /app.
WORKDIR /app

# Copiamos el archivo package.json al contenedor para instalar las dependencias.
COPY package.json /app

# Instalamos las dependencias del proyecto usando npm.
RUN npm install

# Copiamos todo el contenido del proyecto al contenedor.
COPY . /app

# Construimos la aplicación Angular en modo de producción.
RUN npm run build --prod

# Usamos una imagen base de Nginx para servir la aplicación construida.
FROM nginx:latest

# Copiamos el archivo de configuración de Nginx al contenedor.
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Copiamos los archivos generados en la etapa de construcción al directorio donde Nginx sirve los archivos estáticos.
COPY --from=build-step /app/dist/sed-frontend/browser  /usr/share/nginx/html

# Exponemos el puerto 80 para que el contenedor pueda recibir tráfico HTTP.
EXPOSE 80
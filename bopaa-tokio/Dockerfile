# Usa una imagen base de Node.js
FROM node:18

# Establece el directorio de trabajo
WORKDIR /usr/src/app

# Copia los archivos del frontend al contenedor
COPY . .

# Instala las dependencias
RUN npm install

# Construye la aplicación
RUN npm run build

# Usa una imagen ligera para servir la aplicación
FROM nginx:alpine

# Copia la aplicación construida en la carpeta pública de Nginx
COPY --from=0 /usr/src/app/build /usr/share/nginx/html

# Expone el puerto que usará Nginx
EXPOSE 80

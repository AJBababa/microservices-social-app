# Imagen base ligera de Node
FROM node:20

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos del proyecto
COPY . .
RUN npm install

# Exponer el puerto 3000
EXPOSE 3000

# Comando de arranque
CMD node index.js && npm start
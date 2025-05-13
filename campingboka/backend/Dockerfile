# Bruk en lettvekts Node.js base image
FROM node:18-alpine

# Sett arbeidskatalog i containeren
WORKDIR /app

# Kopiér kun package-filer først (for caching av npm install)
COPY package*.json ./

# Installer kun produksjonsavhengigheter
RUN npm install --production

# Kopiér resten av backend-koden
COPY . .

# Sett miljøvariabel
ENV NODE_ENV=production

# Eksponer backend-porten (ikke nødvendig hvis bare internt)
EXPOSE 3000

# Start serveren
CMD ["node", "index.js"]

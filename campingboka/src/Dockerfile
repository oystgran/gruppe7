FROM node:20

# Sett arbeidskatalog i containeren
WORKDIR /campingboka

# Kopier package.json og package-lock.json til /campingboka
COPY package*.json ./

# Installerer avhengigheter
RUN npm install

# Kopier src-mappen til containeren
COPY ./src /campingboka/src

# Eksponer port 8080
EXPOSE 8080

# Kommando for å starte utviklingsserveren
CMD ["npm", "run", "serve"]
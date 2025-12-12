# Etap build
FROM node:18 AS builder
WORKDIR /app
RUN apt-get update && apt-get install -y build-essential python3 make g++
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etap produkcyjny
FROM node:18
WORKDIR /app
RUN apt-get update && apt-get install -y build-essential python3 make g++
COPY --from=builder /app ./
RUN npm ci --omit=dev
ENV NODE_ENV=production
CMD ["node", "dist/main.js"]
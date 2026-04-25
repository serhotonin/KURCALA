# Stage 1: Build the frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Setup the backend
FROM node:20-alpine
WORKDIR /app
COPY server/package*.json ./server/
RUN cd server && npm install
COPY server/ ./server/
COPY --from=frontend-builder /app/dist ./dist

EXPOSE 3001
ENV PORT=3001
ENV NODE_ENV=production

WORKDIR /app/server
CMD ["node", "index.js"]

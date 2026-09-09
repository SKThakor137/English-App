# Multi-stage Dockerfile for NestJS Modular Monolith API
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY backend/package*.json ./backend/
RUN npm ci

COPY backend/ ./backend/
WORKDIR /app/backend
RUN npx prisma generate
RUN npm run build

# Production Runner
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/backend/package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/prisma ./prisma
COPY --from=builder /app/backend/node_modules/.prisma ./node_modules/.prisma

EXPOSE 4000

CMD ["node", "dist/main"]


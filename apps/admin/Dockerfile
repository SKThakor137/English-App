# Multi-stage Dockerfile for Next.js 15 Admin Operations Web App
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY apps/admin/package*.json ./apps/admin/
RUN npm ci

COPY apps/admin/ ./apps/admin/
WORKDIR /app/apps/admin
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Production Runner
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001

COPY --from=builder /app/apps/admin/package*.json ./
COPY --from=builder /app/apps/admin/.next ./.next
COPY --from=builder /app/apps/admin/public ./public
RUN npm ci --only=production

EXPOSE 3001

CMD ["npm", "run", "start"]


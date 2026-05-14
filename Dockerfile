# ── Development stage ──────────────────────────────────────────────────────────
FROM node:22-alpine AS dev
WORKDIR /app
EXPOSE 4321
CMD ["sh"]

# ── Production build stage ─────────────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ── Production serve stage ─────────────────────────────────────────────────────
FROM nginx:alpine AS prod
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80

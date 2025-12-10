# ---------- Builder ----------
FROM node:20-alpine AS build
WORKDIR /app

# Install production dependencies
COPY backend/package.json backend/package-lock.json* ./backend/
RUN cd backend && npm ci --omit=dev

# Copy backend source
COPY backend ./backend

# ---------- Runtime ----------
FROM node:20-alpine
WORKDIR /app

# Create non-root user
RUN addgroup -S nodegroup && adduser -S nodeuser -G nodegroup

# Copy app
COPY --from=build /app/backend /app

# Env defaults (override via docker-compose/K8s)
ENV NODE_ENV=production
ENV PORT=5000

# Healthcheck uses your /api/health endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://localhost:${PORT}/api/health || exit 1

EXPOSE 5000
USER nodeuser

# ADD THIS LINE - Tell the container what to run
CMD ["node", "server.js"]
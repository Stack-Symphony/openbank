
# ---------- Builder ----------
FROM node:20-alpine AS build
WORKDIR /app
# Install deps
COPY frontend/package.json frontend/package-lock.json* ./frontend/
RUN cd frontend && npm ci
# Copy source
COPY frontend ./frontend
# Build static site (Vite/React)
RUN cd frontend && npm run build

# ---------- Runtime ----------
FROM nginx:1.27-alpine
# Copy built assets to Nginx html
COPY --from=build /app/frontend/dist /usr/share/nginx/html
# Default Nginx serves port 80
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:80/ || exit 1
CMD ["nginx", "-g", "daemon off;"]

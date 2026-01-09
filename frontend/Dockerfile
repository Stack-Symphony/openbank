# Stage 1: Build React app
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json & package-lock.json first for caching
COPY package*.json ./

# Force clean npm cache and retry install
RUN npm cache clean --force && \
    npm install --legacy-peer-deps --retry 5 --fetch-retries=5 --fetch-timeout=60000

# Copy the rest of the app
COPY . .

# Build the app
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

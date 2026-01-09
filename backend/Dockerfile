# Backend Dockerfile

FROM node:18-alpine
WORKDIR /app

# Copy package.json and package-lock.json first (caching npm install)
COPY package*.json ./
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Set environment variables
ENV PORT=5000
ENV NODE_ENV=production
ENV MONGODB_URI=mongodb://mongo:27017/openbank 

# Expose port
EXPOSE 5000

# Start the application
CMD ["node", "server.js"]

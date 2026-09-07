FROM node:20-alpine

WORKDIR /app

# Copy package manifests
COPY package*.json ./

# Install production dependencies
RUN npm install --omit=dev

# Copy application code
COPY . .

# Expose backend port
EXPOSE 3500

# Set environment
ENV NODE_ENV=production
ENV PORT=3500

CMD ["node", "server.js"]

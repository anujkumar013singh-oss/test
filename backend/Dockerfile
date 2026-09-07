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

# Healthcheck to backend root/status
HEALTHCHECK --interval=30s --timeout=5s CMD wget -q -O /dev/null http://localhost:3500/api/health || exit 1

CMD ["node", "server.js"]

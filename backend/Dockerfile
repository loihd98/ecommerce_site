FROM node:18-alpine

# Install system dependencies
RUN apk update && apk add --no-cache \
    openssl \
    ca-certificates \
    libc6-compat \
    && rm -rf /var/cache/apk/*

WORKDIR /app

# Copy package files
COPY package.json yarn.lock* ./

# Install dependencies
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

RUN if [ "$NODE_ENV" = "production" ]; then \
    yarn install --production --network-timeout 300000; \
    else \
    yarn install --network-timeout 300000; \
    fi

# Copy Prisma schema and generate client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy source code
COPY src ./src/

# Create upload directories
RUN mkdir -p /uploads/images /uploads/videos && \
    chown -R node:node /uploads

# Switch to non-root user
USER node

EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "const http = require('http'); http.get('http://localhost:5000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1); });"

CMD ["node", "src/index.js"]

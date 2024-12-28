# Base stage
FROM node:22-slim AS base
WORKDIR /workdir

# Development stage
FROM base AS development
RUN apt-get update && \
    apt-get clean && \
    apt-get install -y sqlite3 libsqlite3-dev && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /workdir

COPY package*.json ./
RUN npm install

COPY tsconfig.json package*.json register.js vite.config.ts ./
COPY src ./src
COPY prisma ./prisma
COPY tests ./tests

RUN npm run prisma:generate

EXPOSE 3000

CMD ["npm", "run", "dev"]

# Builder stage
FROM base AS builder
RUN apt-get update && \
    apt-get clean && \
    apt-get install -y sqlite3 libsqlite3-dev && \
    rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci

COPY tsconfig.json package*.json register.js vite.config.ts ./
COPY src ./src
COPY prisma ./prisma
COPY tests ./tests

RUN npm run prisma:generate
RUN npm run build

# Production stage
FROM base AS production
RUN apt-get update && \
    apt-get clean && \
    apt-get install -y sqlite3 libsqlite3-dev && \
    rm -rf /var/lib/apt/lists/*

COPY --from=builder /workdir/node_modules ./node_modules
COPY --from=builder /workdir/dist ./dist
COPY --from=builder /workdir/prisma ./prisma
COPY --from=builder /workdir/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]
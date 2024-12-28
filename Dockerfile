FROM node:20-slim

RUN apt-get update && \
    apt-get clean && \
    apt-get install -y sqlite3 libsqlite3-dev && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /workdir

COPY package*.json ./
RUN npm install

COPY tsconfig.json package*.json register.js vite.config.ts ./
COPY src ./src
COPY tests ./tests

RUN npm run prisma:generate

EXPOSE 3000

CMD ["npm", "run", "dev"]
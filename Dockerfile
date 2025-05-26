FROM node:22-slim AS builder

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:22-slim

COPY package.json package-lock.json ./
RUN npm ci

COPY --from=builder /usr/src/app/build .

CMD ["node", "index.js"]

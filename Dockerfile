FROM node:22-slim AS builder

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
COPY contrib ./contrib

RUN npm install

COPY . .

RUN npm run build

FROM node:22-slim

COPY package.json package-lock.json ./
COPY contrib ./contrib
RUN npm ci --omit=dev

COPY --from=builder /usr/src/app/build .

CMD ["node", "index.js"]

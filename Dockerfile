FROM node:20-alpine

RUN apk add --no-cache bash

WORKDIR /app

# Install app dependencies (includes tsx for running mock-api)
COPY package.json package-lock.json* ./
RUN npm install

# Install mock-api dependencies
COPY mock-api/package.json mock-api/
RUN cd mock-api && npm install

# Copy source
COPY . .

EXPOSE 5173 3001

CMD ["sh", "-c", "node --import tsx mock-api/server.ts & npm run dev"]

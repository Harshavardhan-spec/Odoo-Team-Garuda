FROM node:18-alpine

WORKDIR /app

# Copy package configurations first for caching
COPY package.json ./

RUN npm install

# Copy source code
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]

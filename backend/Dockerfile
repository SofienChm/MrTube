FROM node:20-alpine
WORKDIR /app

RUN apk add --no-cache python3 py3-pip make g++
RUN pip install --break-system-packages yt-dlp

COPY package*.json ./
RUN npm install

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["sh", "-c", "npx prisma db push --accept-data-loss 2>/dev/null; node dist/src/main.js"]

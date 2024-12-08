FROM node:alpine

RUN apk add --no-cache tzdata python3 py3-pip build-base g++ cairo-dev pango-dev giflib-dev
ENV TZ=Asia/Tashkent

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

EXPOSE 3003

CMD ["npm", "run", "start:bot"]
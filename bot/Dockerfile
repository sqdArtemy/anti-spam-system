FROM node:alpine

#timezone
RUN apk add --no-cache tzdata
ENV TZ=Asia/Tashkent

WORKDIR /app
COPY package.json ./
RUN rm -rf node_modules
COPY . .
RUN npm install
EXPOSE 3003
CMD ["npm", "run", "start:bot"]

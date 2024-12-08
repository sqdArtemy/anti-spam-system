FROM node:alpine

WORKDIR /app

COPY package.json ./

RUN npm install

RUN npm install @rollup/rollup-linux-x64-gnu --save-optional

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
#CMD ["tail", "-f", "/dev/null"]

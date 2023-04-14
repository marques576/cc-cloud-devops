FROM node:latest

WORKDIR /usr/app

COPY package.json .
COPY . /usr/app/

RUN npm install

ENTRYPOINT ["npx","ts-node","app.ts"]
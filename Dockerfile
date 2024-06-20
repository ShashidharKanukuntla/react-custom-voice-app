FROM node:14-alpine

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

COPY . .

EXPOSE 3000

CMD ["yarn", "start"]

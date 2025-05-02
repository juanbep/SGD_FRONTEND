FROM node:22-alpine AS build-step

RUN mkdir -p /app

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

RUN npm run build --prod

FROM nginx:latest

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build-step /app/dist/sed-frontend/browser  /usr/share/nginx/html

EXPOSE 80
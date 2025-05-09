FROM node:22-alpine AS build-step

WORKDIR /app

COPY package.json /app
RUN npm install

COPY . /app

RUN npm run build -- --base-href=/sed-front/ --deploy-url=/sed-front/

FROM nginx:latest

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-step /app/dist/sed-frontend/browser /usr/share/nginx/html/sed-front

EXPOSE 80
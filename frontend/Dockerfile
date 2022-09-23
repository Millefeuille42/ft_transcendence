FROM node:16-alpine as build-app-stage

RUN apk update && apk upgrade
RUN apk add python3 make g++

ARG VUE_APP_BACK_URL
ENV VUE_APP_BACK_URL $VUE_APP_BACK_URL

WORKDIR /app
RUN chown -R node:node /app

USER node

COPY --chown=node:node app/package*.json ./
RUN npm install
COPY --chown=node:node app/ .
RUN npm run build

FROM node:16-alpine as build-game-stage

RUN apk update && apk upgrade
RUN apk add python3 make g++

WORKDIR /game
RUN chown -R node:node /game

USER node

COPY --chown=node:node game/package*.json ./
RUN npm install
COPY --chown=node:node game/ .
RUN npm run build

FROM nginx:stable-alpine as production-stage

ARG VUE_APP_BACK_URL
ENV VUE_APP_BACK_URL $VUE_APP_BACK_URL

COPY --from=build-app-stage /app/dist /usr/share/nginx/html
COPY --from=build-game-stage /game/dist /usr/share/nginx/html
COPY conf/nginx.conf /etc/nginx/conf.d/pdf.conf
COPY scripts ./scripts
WORKDIR ./scripts

RUN apk add postgresql-client

EXPOSE 80

CMD sh init.sh

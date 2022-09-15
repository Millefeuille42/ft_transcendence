FROM node:18-alpine as build-app-stage

WORKDIR /app
RUN chown -R node:node /app

USER node

COPY --chown=node:node app/package*.json ./
RUN npm install
COPY --chown=node:node app/ .
RUN npm run build

FROM node:18-alpine as build-game-stage

WORKDIR /game
RUN chown -R node:node /game

USER node

COPY --chown=node:node game/package*.json ./
RUN npm install
COPY --chown=node:node game/ .
RUN npm run build

FROM nginx:stable-alpine as production-stage

COPY --from=build-app-stage /app/dist /usr/share/nginx/html
COPY --from=build-game-stage /game/dist /usr/share/nginx/html
COPY conf/nginx.conf /etc/nginx/conf.d/pdf.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

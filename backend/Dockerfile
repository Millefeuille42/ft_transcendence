FROM node:18-alpine as build-stage

RUN apk add --update python make g++\
   && rm -rf /var/cache/apk/*

WORKDIR /usr/src/app
COPY --chown=node:node app/package*.json ./
RUN npm install
COPY --chown=node:node app/. .
RUN npm run build

FROM node:18-alpine as production-stage

WORKDIR /usr/src/app
EXPOSE 3000
USER node

COPY --from=build-stage /usr/src/app ./

ENV NODE_ENV production

CMD npm run start

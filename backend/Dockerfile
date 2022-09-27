FROM node:16-alpine as build-stage

RUN apk update && apk upgrade
RUN apk add python3 make g++

WORKDIR /usr/src/app
COPY --chown=node:node app/package*.json ./
RUN npm install
COPY --chown=node:node app/. .
RUN npm run build

FROM node:16-alpine as production-stage

RUN apk add postgresql-client

WORKDIR /usr/src/app
EXPOSE 3000
USER node

COPY --from=build-stage /usr/src/app ./

ENV NODE_ENV production

CMD sleep 10 && export PGPASSWORD="$DB_PASS" && echo "CREATE DATABASE $DB_NAME;" | psql -h db -U $DB_USER && npm run start

FROM node:12-alpine

EXPOSE 3000

RUN apk add --update tini

RUN mkdir /opt/node_app && chown node:node /opt/node_app
WORKDIR /opt/node_app

USER node

COPY --chown=node:node package*.json ./
RUN npm install --no-optional && npm cache clean --force

COPY --chown=node:node src ./src
WORKDIR /opt/node_app/src

CMD /sbin/tini -- node ./app.js

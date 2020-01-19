FROM alpine:edge

RUN addgroup -S node && adduser -S node -G node

# upgrade and install build-essentials and python to later on build bcrypt and mongoose
RUN apk update && apk upgrade --progress && apk add --virtual build-dependencies build-base python gcc

# google chrome dependencies to run puppeteer
RUN apk add chromium

# install nodejs and npm
RUN apk add nodejs npm

RUN mkdir /app && chown -R node:node /app

WORKDIR /app

COPY package*.json ./

USER node

# also prevent puppeteer from downloading bundled chromium as it was installed above
ENV NODE_ENV=docker PUPPETEER_ENV=docker PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

COPY --chown=node:node . .

RUN npm install --verbose && npm run build

USER root

RUN rm -vrf /var/cache/apk/* && apk del build-dependencies

USER node

EXPOSE 5000

CMD [ "npm", "start" ]
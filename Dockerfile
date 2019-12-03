FROM ubuntu:18.04

RUN groupadd --gid 1000 node \
    && useradd --uid 1000 --gid node --shell /bin/bash --create-home node

# upgrade and install build-essentials and python to later on build bcrypt and mongoose
RUN apt update && apt upgrade -y && apt install build-essential python2.7 curl wget -y

# install nodejs and npm
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash - && apt install -y nodejs

RUN mkdir /home/node/api-server && chown -R node:node /home/node/api-server

WORKDIR /home/node/api-server

COPY package*.json ./

USER node

COPY --chown=node:node . .

RUN npm install && npm run build

EXPOSE 5000

CMD [ "npm", "start", "--silent" ]

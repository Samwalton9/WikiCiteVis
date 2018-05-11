FROM node:9.11.1

WORKDIR /srv/app/

COPY package.json package-lock.json /srv/app/

RUN npm install --force

COPY . .

CMD node_modules/.bin/gulp serve

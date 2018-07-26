FROM node:9.11.1

WORKDIR /srv/app/

COPY package.json package-lock.json /srv/app/

RUN npm install --force

RUN npm install http-server -g

COPY . .

RUN node_modules/.bin/gulp build

CMD http-server build/


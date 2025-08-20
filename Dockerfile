FROM node:current-alpine3.22

WORKDIR /books-app

COPY . .

RUN npm install
RUN chmod +x ./entrypoint.sh

EXPOSE 3000

ENTRYPOINT ./entrypoint.sh
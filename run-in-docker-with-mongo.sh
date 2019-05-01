#!/usr/bin/env bash

# USAGE: ./run-from-here.sh

PORT=3000
DB_PORT=27017

echo "Generate Dockerfile from ./ ..."
cat > Dockerfile << CONTENTS
FROM node:10
WORKDIR /usr/src/app
COPY . .
RUN npm install
EXPOSE ${PORT}
CMD [ "npm", "start" ]
CONTENTS

echo "Generate docker-compose.yml from ./ ..."
cat > docker-compose.yml << CONTENTS
version: '3'
services:
  mongo:
    image: mongo:4
    command: mongod --port ${DB_PORT}
    volumes:
      - /data
    ports:
      - "${DB_PORT}:${DB_PORT}"
  web:
    depends_on:
      - mongo
    build: .
    user: "node"
    restart: "no"
    ports:
      - "${PORT}:${PORT}"
    environment:
      - PORT=${PORT}
      - MONGODB_URI="mongodb://mongo:${DB_PORT}"
CONTENTS

echo ""
echo "(Press Ctrl-C to exit)"
docker-compose up --build

echo ""
rm Dockerfile && echo "✅ Deleted the generated Dockerfile."
rm docker-compose.yml && echo "✅ Deleted the generated docker-compose.yml."

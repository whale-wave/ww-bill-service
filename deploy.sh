#!/bin/bash

git pull
pwd
cd ../ww-bill-client
pwd
git pull
cd ../ww-bill-service

docker image prune -f
docker-compose down
docker-compose up --build -d

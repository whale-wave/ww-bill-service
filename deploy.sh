#!/bin/bash

git pull
pwd
cd ../ww-bill-client
pwd
git pull
cd ../ww-bill-service

docker-compose down
docker-compose up --build -d

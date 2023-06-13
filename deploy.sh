#!/bin/bash

git pull origin master
pwd
cd ../ww-bill-client
pwd
git pull origin master
cd ../ww-bill-service

docker-compose down
docker-compose up --build -d

#!/bin/bash
PROJECT="wxyyxc1992-web-app"

git pull

cd ui

echo 'start install dependencies.'
yarn install
echo 'start build src.'
yarn build

echo 'start build docker image.'
docker build -t ${PROJECT}:latest -f ./deploy/Dockerfile .

echo 'stop and remove the current container.'
docker container stop ${PROJECT}
docker container rm ${PROJECT}

echo 'run a new container.'
docker run -d --restart always -p 10001:2015 --name ${PROJECT} ${PROJECT}:latest
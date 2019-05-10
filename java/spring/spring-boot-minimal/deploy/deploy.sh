#!/bin/bash
PROJECT="spring-boot-minimal"

git pull

echo 'start build java'
./gradlew spotlessApply
./gradlew build -x test

echo 'start build docker image.'
docker build -t ${PROJECT}:latest -f ./deploy/Dockerfile .

echo 'stop and remove the current container.'
docker container stop ${PROJECT}
docker container rm ${PROJECT}

echo 'run a new container.'
docker run -d --restart always -p 7001:7001 --name ${PROJECT} -v ~/logs/wsat-server:/root/logs -v /tmp:/tmp -v /var/run/docker.sock:/var/run/docker.sock ${PROJECT}:latest

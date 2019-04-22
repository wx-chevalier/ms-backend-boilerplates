#!/usr/bin/env bash

# 创建 volume
for v in gitlab_config gitlab_logs gitlab_data gitlab_runner_config
do
    if [ ! "$(docker volume ls -qf name=${v})" ]; then
        echo "创建 volume $v"
        docker volume create $v > /dev/null
    fi
done

# 启动 gitlab
echo "启动 gitlab"
docker-compose up -d

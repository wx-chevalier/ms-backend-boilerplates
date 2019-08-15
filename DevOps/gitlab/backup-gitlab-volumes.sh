#!/bin/bash

# $1: 备份目录，注意使用绝对路径；最终备份目录在 $1/当前时间目录

backups_dir=${1:-/opt/backups/gitlab}
backup_dir=$backups_dir/$(date +"%Y_%m_%d_%H_%M_%S")
mkdir -p $backup_dir

echo "备份到 $backup_dir"

for v in gitlab_config gitlab_logs gitlab_data gitlab_runner_config
do
    echo "备份 volume $v"
    docker run -it --rm \
           -v ${v}:/volume \
           -v ${backup_dir}:/backup \
           -w /volume \
           alpine \
           tar -zcf /backup/${v}.tar.gz .
done

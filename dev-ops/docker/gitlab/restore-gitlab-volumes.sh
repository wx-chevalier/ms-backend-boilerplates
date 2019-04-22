#!/usr/bin/env bash

# $1: 备份目录，注意使用绝对路径；该目录下包含 gitlab_data.tar.gz gitlab_config.tar.gz gitlab_logs.tar.gz

restore_dir=$1

if [[ ! -d $restore_dir || ! -f $restore_dir/gitlab_data.tar.gz ]]; then
    echo "备份目录有误，$restore_dir/gitlab_data.tar.gz 不存在"
    exit 1
fi

if [ "$(docker ps -aq -f name=gitlab)" ]; then
    echo "容器 gitlab 存在，注意备份并删除它再进行恢复操作"
    exit 1
fi

echo "启动 gitlab, 使用备份目录 ${restore_dir}"

clear_volume() {
    volume_name=$1
    if [ "$(docker volume ls -qf name=${volume_name})" ]; then
        docker run -it --rm $volume_name:/volume \
               -w /volume \
               busybox sh -c 'rm -rf /volume/*'
    else
        docker volume create $volume_name
    fi
}

for v in gitlab_config gitlab_data gitlab_logs
do
    echo "清空 $v"
    clear_volume $v
    if [ -f $restore_dir/$v.tar.gz ]; then
        echo "恢复 $v <- ${restore_dir}/${v}.tar.gz"
        docker run -it --rm \
               -v ${v}:/volume \
               -v ${restore_dir}:/backup \
               -w /volume \
               busybox sh -c "tar xfz /backup/${v}.tar.gz"
    fi
done

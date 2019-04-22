# Gitlab

## 启动、备份、还原

### 直接启动

`./start-gitlab.sh`

### 备份数据卷

`./backup-gitlab-volumes.sh /path/to/backup` 将卷备份到 `/path/to/backup/时间` 目录下，其中包含 `gitlab_data.tar.gz`, `gitlab_config.tar.gz`, `gitlab_logs.tar.gz`, `gitlab_runner_config.tar.gz` 三个备份文件。

默认备份到 `/opt/backups/gitlab` 下。

### 恢复某份数据卷

```sh
# 首先移除 gitlab 容器
docker rm -f gitlab

# 先备份当前数据卷
./backup-gitlab-volumes.sh /path/to/backup

# 还原卷
./restore-gitlab-volumes.sh /path/to/backup/时间

# 启动 gitlab
./start-gitlab.sh
```

## 添加 RUNNER

- [不要添加 tag](https://forum.gitlab.com/t/the-job-is-stuck-because-you-dont-have-any-active-runners/20838/2)

```sh
docker exec -it gitlab_runner-docker_1 \
    gitlab-ci-multi-runner register \
    --url https://gitlab.wsat-scan.com \
    --registration-token Y-oiz6RJFkw-qjc9eKyS \
    --executor docker \
    --description "Image building Runner" \
    --docker-image "docker:git" \
    --docker-privileged
```

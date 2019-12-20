# Dockerfiles

## 测试数据库

镜像构建：

```sh
docker build -t oracle-xe-11g:zh_cn .
```

启动：

```sh
# 项目根目录执行
docker run --name test-orcale -d \
       -p 11521:1521 \
       -e ORACLE_ALLOW_REMOTE=true \
       -e ORACLE_DISABLE_ASYNCH_IO=true \
       -v ${PWD}/dockerfiles/oracle-docker-entrypoint-initdb.d/:/docker-entrypoint-initdb.d/ \
       oracle-xe-11g:zh_cn
```

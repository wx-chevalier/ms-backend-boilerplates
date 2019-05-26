# mysql-mall-matrix

mysql-mall-matrix 是笔者日常项目中总结的电商系统的表结构设计，详细讨论参考 [电商系统的结构设计 https://url.wx-coder.cn/EHTAg](https://url.wx-coder.cn/EHTAg)。

# Deploy

```sh
# Build image
$ ./build-image.sh

# 无目录共享运行
$ docker run --rm --name=mysql-mall-matrix -p 3306:3306 mysql-mall-matrix

# 自定义配置文件
$ docker run --rm --name=mysql-mall-matrix -p 3306:3306 -v ./etc:/etc/mysql/conf.d mysql-mall-matrix

# MAC 下添加特殊目录共享
$ docker run -d --restart always --name=mysql-mall-matrix  -v ~/Desktop/test/mysql:/var/lib/mysql mysql-mall-matrix

$ docker run -d --restart always --name=mysql-mall-matrix -v /var/test/mysql:/var/lib/mysql mysql-mall-matrix

# Test db
$ docker run --rm -ti --name=mycli \
  --link=mysql-mall-matrix:mysql \
  diyan/mycli \
  --host=mysql \
  --database=test \
  --user=root \
  --password=roottoor
```

# mysql-ecommerce

mysql-ecommerce 是笔者日常项目中总结的电商系统的表结构设计，详细讨论参考 [电商系统的结构设计 https://url.wx-coder.cn/EHTAg](https://url.wx-coder.cn/EHTAg)。

# Deploy

```sh
# Build image
$ ./build-image.sh

# 无目录共享运行
$ docker run --rm --name=mysql-ecommerce -p 3306:3306 mysql-ecommerce

# 自定义配置文件
$ docker run --rm --name=mysql-ecommerce -p 3306:3306 -v ./etc:/etc/mysql/conf.d mysql-ecommerce

# MAC 下添加特殊目录共享
$ docker run -d --restart always --name=mysql-ecommerce  -v ~/Desktop/test/mysql:/var/lib/mysql mysql-ecommerce

$ docker run -d --restart always --name=mysql-ecommerce -v /var/test/mysql:/var/lib/mysql mysql-ecommerce

# Test db
$ docker run --rm -ti --name=mycli \
  --link=mysql-ecommerce:mysql \
  diyan/mycli \
  --host=mysql \
  --database=test \
  --user=root \
  --password=roottoor
```

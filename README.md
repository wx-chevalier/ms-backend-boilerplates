![](https://i.postimg.cc/qvkqRvPk/image.png)

# Backend Boilerplates | 服务端应用项目模板

该仓库存放了笔者服务端开发、部署、运维相关的实践模板，可以在下列 GitBook 仓库中查看理论内容：

| [Awesome Lists](https://ngte-al.gitbook.io/i/) | [Awesome CheatSheets](https://ngte-ac.gitbook.io/i/) | [Awesome Interviews](https://github.com/wx-chevalier/Developer-Zero-To-Mastery/tree/master/Interview) | [Awesome RoadMaps](https://github.com/wx-chevalier/Developer-Zero-To-Mastery/tree/master/RoadMap) | [Awesome-CS-Books-Warehouse](https://github.com/wx-chevalier/Awesome-CS-Books-Warehouse) |
| ---------------------------------------------- | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |


| [编程语言理论与实践](https://ngte-pl.gitbook.io/i/) | [软件工程、数据结构与算法、设计模式、软件架构](https://ngte-se.gitbook.io/i/) | [现代 Web 开发基础与工程实践](https://ngte-web.gitbook.io/i/) | [大前端混合开发与数据可视化](https://ngte-fe.gitbook.io/i/) | [服务端开发实践与工程架构](https://ngte-be.gitbook.io/i/) | [分布式基础架构](https://ngte-infras.gitbook.io/i/) | [数据科学，人工智能与深度学习](https://ngte-aidl.gitbook.io/i/) | [产品设计与用户体验](https://ngte-pd.gitbook.io/i/) |
| --------------------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------- | ----------------------------------------------------------- | --------------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------- |


也可以关注公众号[某熊的技术之路](https://i.postimg.cc/vH5XmBzr/qrcode-for-gh-f6ddfe4d9124-344.jpg)获取更多服务端开发相关的 **知识图谱/学习路径/文章书籍/实践代码** 等，或者前往[个人主页](http://wxyyxc1992.github.io/home/)进行交互式检索。

# Nav | 导航

鉴于项目包含的子项目较多，建议您是要 [GitZip](https://parg.co/QjH) 工具来便捷、独立下载所需的项目。

## Java

所有的 Java 包名以 wx 开头，譬如 `wx.spring`, `wx.akka` 等。

- [Akka](./java/akka)

```
akka-agent            akka-persistence      akka-spring-boot
akka-cluster          akka-persistence-dc   akka-start
akka-distributed-data akka-router           akka-supervision
akka-fsm              akka-sharding         akka-websocket
akka-future           akka-spring
```

- [Dubbo](./java/dubbo)

* [Spring & Spring Boot & Spring Cloud](./java/spring): 建议使用 spring-boot-minimal 作为空白模板，使用 spring-boot-production 作为生产环境下模板。

```sh
spring-boot-mybatis-annotation  spring-reactive                 spring-security-jwt
spring-boot-druid-dynamic-ds    spring-boot-mybatis-page-helper spring-reactive-client          spring-security-login
spring-boot-gradle              spring-boot-mybatis-xml         spring-reactive-functional      spring-security-oauth2
spring-boot-grpc                spring-boot-production(*)       spring-reactive-oauth           spring-security-rest
spring-boot-hikari-dynamic-ds   spring-boot-test                spring-reactive-security        spring-security-socket
spring-boot-minimal(*)          spring-cloud-minimal            spring-security-5               spring-security-taglibs
spring-boot-multiple-modules    spring-rarf                     spring-security-basic-auth
```

## Node.js

- [Express](./node/express):express-jwt, express-passport, express-minimal, express-ts

* [Koa](./node/koa)

* [Egg.js](./node/egg): egg-graphql, egg-ts-minimal, egg-minimal, egg-ts-typeorm-graphql, egg-ts-knex-sequelize

- [Nest.js](./node/nest): nest-jwt, nest-minimal, nest-production

* [GraphQL](./node/graphql): apollo-server,koa, simple, express, prisma

## Go

- [Beego](./go/beego)

- [Docker](./go/go-docker)

## Python

- [Basic](./python/basic)

- [Pipenv](./python/pipenv)

## Rust

## Database | 数据库模板

- [Mongodb](./db/mongodb): mongodb-cluster, mongodb-local

- [Mysql](./db/mysql): mysql-backup, mysql-ecommerce, mysql-master-salve,mysql-replication, mysql-benchmark, mysql-local, mysql-random-data-generator

- [Presto](./db/presto): presto-chart, presto-launcher, presto-server

- [Redis](./db/redis): redis-local, redis-sentinel

## DevOps | 运维脚本

- [ELK](./dev-ops/elk)

- [Gitlab](./dev-ops/gitlab)

- [linux-scripts](./dev-ops/linux-scripts)

- [prometheus](./dev-ops/prometheus)

- [Sentry](./dev-ops/sentry)

## Infrastructure

- [K8s](./dev-ops/k8s): helm-spring, offline-install.sh

# Motivation & Credits

[![image.png](https://i.postimg.cc/y1QXgJ6f/image.png)](https://postimg.cc/bZFSQcfz)

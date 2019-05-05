![](https://i.postimg.cc/qvkqRvPk/image.png)

# Backend Boilerplates | 服务端应用项目模板

该仓库存放了笔者服务端开发、部署、运维相关的实践模板，具体内容如下导航所示。

# Nav | 导航

欢迎关注公众号[某熊的技术之路](https://i.postimg.cc/vH5XmBzr/qrcode-for-gh-f6ddfe4d9124-344.jpg)获取更多服务端开发相关的 **知识图谱/学习路径/文章书籍/实践代码** 等，或者前往[个人主页](http://wxyyxc1992.github.io/home/)进行交互式检索。

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

* [Spring & Spring Boot & Spring Cloud](./java/spring)

建议使用 spring-boot-minimal 作为空白模板，使用 spring-boot-production 作为生产环境下模板。

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

- [Express](./node/express)

```sh
express-jwt      express-passport
express-minimal  express-ts
```

- [Koa](./node/koa)

- [Egg.js](./node/egg)

```sh
egg-graphql            egg-ts-minimal
egg-minimal            egg-ts-typeorm-graphql
egg-ts-knex-sequelize
```

- [Nest.js](./node/nest)

```sh
nest-jwt        nest-minimal    nest-production
```

- [GraphQL](./node/graphql)

```
apollo-server koa           simple
express       prisma
```

## Go

```sh
beego-minimal       graphql          standards-layout
```

## Python

## Rust

## DevOps | 运维脚本

- [Docker](./dev-ops/docker): DockerX is a collection of configs, Dockerfiles, and Compose files to build images, applications, and clusters the way you need them. DockerX covers multiple fields: Server Side Application, DevOps, SRE, Cluster Orchestration, Microservices, etc.

```sh
caddy      java       prometheus serverless
compose    mysql      python
elk        node       redis
go         presto     sentry
```

- [K8s](./dev-ops/k8s)

```sh
helm-spring        offline-install.sh
```

- [linux-scripts](./dev-ops/linux-scripts)

```sh
cleanup             harden
```

## Database | 数据库模板

```sh
mysql              mysql-benchmark    mysql-master-salve mysql-replication  oracle
```

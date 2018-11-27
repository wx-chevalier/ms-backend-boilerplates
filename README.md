# Backend Application Boilerplate | 服务端应用项目模板

# TOC | 目录

## Framework | 编程框架

### Java

所有的 Java 包名以 wx 开头，譬如 `wx.spring`, `wx.akka` 等。

- [Spring](./java/spring)

```sh
spring-boot-gradle                  spring-boot-maven-multiple-modules  spring-reactive-functional          spring-security-login
spring-boot-gradle-minimal          spring-boot-test                    spring-reactive-oauth               spring-security-oauth2
spring-boot-gradle-multiple-modules spring-cloud-minimal                spring-reactive-security            spring-security-rest
spring-boot-grpc                    spring-rarf                         spring-security-5                   spring-security-socket
spring-boot-maven                   spring-reactive                     spring-security-basic-auth          spring-security-taglibs
spring-boot-maven-minimal           spring-reactive-client              spring-security-jwt
```

- [Dubbo](./java/dubbo)

  - [spring-boot](./java/spring-boot): Dubbo 与 Spring Boot 集成使用示例

- [Akka](./java/akka)

### Node.js

- [Express](./node/express)

  - [minimal](./node/express/minimal): Express 最小化模板
  - [ts](./node/express/ts): TypeScript 模板
  - [JWT](./node/express/jwt): 集成 JWT 权限认证模板
  - [Passport](./node/express/passport): 集成 Passport 权限认证模板

- [Koa](./node/koa)

- [Egg.js](./node/egg)

  - [minimal](./node/egg/minimal): Egg.js 最小化模板
  - [typescript-minimal](./node/egg/ts-minimal): TypeScript 最小化模板
  - [typescript](./node/egg/ts-minimal): 完整的 TypeScript 生产项目模板，包括了 Sequelize, Knex, Bookshelf, GraphQL 等多重特性配置

- [Nest.js](./node/nest)

- [GraphQL](./node/graphql)

### Go

- [beego-minimal](./go/beego-minimal)

### GraphQL

## Infrastructure | 运维脚本

- [Docker]()

- [K8s]()

- [linux-scripts]()

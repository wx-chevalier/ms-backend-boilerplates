# DockerX

DockerX is a collection of configs, Dockerfiles, and Compose files to build images, applications, and clusters the way you need them. DockerX covers multiple fields: Server Side Application, DevOps, SRE, Cluster Orchestration, Microservices, etc.

ServicesD 是笔者在日常工作中使用到的一系列 Docker 镜像集锦，涉及到应用部署、集群架构、站点质量保障、微服务治理等多个方面。

The following is table of contents:

---

- [Java](./java)

  - [Maven](./java/maven): using Maven to compile and build applications as jar

  - [Jar](./java/jar): only run the jar by java

- [Python](./python)

- [Go](./go): basic Dockerfile for Go, with live reloading, package management, and size optimization.

---

- [DockerX](#dockerx)

  - [Gateway](./caddy/gateway): Gateway for transparent reverse proxy

  - [Static Server](./caddy/static): Static server with HTTP Basic Auth and Cache, etc.

- [Node.js](./node.js)

  - [pm2](./node.js/pm2)

- [Prometheus](./prometheus)

- [Sentry](./sentry)

- [Serverless](./serverless): Solution for Building Serverless Architecture

  - [faas](./serverless/faas)

---

- [Mysql](./mysql)

- [Redis](./redis)

- [elk](./elk)

  - [Local Mode](./elk/local): Elastic Search and Kibana in Single Node

  - [HA Mode](./elk/ha): High Available ES Cluster with two nodes

  - [Swarm HA Mode](./elk/swarm-ha): High Available ES Cluster Managed by Swarm

- [Presto](./presto)

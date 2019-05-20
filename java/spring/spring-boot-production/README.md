# Spring Boot Boilerplate, with Mybatis, Swagger, JWT & RBAC

# Development 

* 启动测试用数据库

```sh
docker run -d -p 3306:3306 \
       -e MYSQL_ALLOW_EMPTY_PASSWORD=yes \
       -v ${PWD}/src/main/resources/db/mysql:/docker-entrypoint-initdb.d \
       --name mysql-dev \
       mysql:5.7.14
```

* 启动服务

```sh
./gradlew build --continous

./gradlew build --continous -x test

./gradlew bootRun
```

* 测试接口

```bash
# 注册
$ curl -H "Content-Type: application/json" -X POST -d '{
"name": "admin",
"password": "password"
}' http://localhost:9000/user/sign-up

# 登录
$ curl -i -H "Content-Type: application/json" -X POST -d '{
"name": "admin",
"password": "password"
}' http://localhost:9000/login

# 获取用户
$ curl -i -H "Content-Type: application/json" \
   -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTUzOTk0MTU2MH0.XHW5AKXzyWEVtfKzAr6H7rO3nN1Lnl4b_g3beVqC0Ovy5y4qEeHISYoo8Q50CoIDz0KdbP_GXd461MWK_rOmwg" \
   http://localhost:9000/user
```
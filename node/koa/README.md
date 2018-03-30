# Node Server Boilerplate

目前主要基于 Koa+Webpack+Babel+Swagger，将项目 git clone 到本地后，即可运行：

```$xslt
# 安装依赖
yarn install

# 启动服务器
npm start
```

- 查看根路径
```$xslt
http://localhost:8080/
```

- 查看用户信息(路径参数)
```$xslt
    # 这里使用了根路径 /api
    http://localhost:8080/api/user/2
```

- 查看任意其他路径(权限控制下会自动跳转回根路径)

```$xslt
    http://localhost:8080/not-found
```

- 查看静态资源处理
```$xslt
    http://localhost:8080/static/
```

- 查看 Swagger
```$xslt
    # 查看 Swagger 接口文档
    http://localhost:8080/swagger/
    # 查看 JSON 数据
    http://localhost:8080/swagger/api.json
```

> [swagger-decorator：注解方式为 Koa2 应用自动生成 Swagger 文档](https://parg.co/bvx) 从属于笔者的[服务端应用程序开发与系统架构](https://parg.co/bvT)，记述了如何在以 Koa2 与 koa-router 开发服务端应用时，通过自定义 swagger-decorator 库来实现类 Spring-Boot 中注解方式动态生成 Swagger 标准的接口文档。

# swagger-decorator：注解方式为 Koa2 应用动态生成 Swagger 文档

目前我司服务端应用程序框架主要采用了 Java Spring 与 Node.js，而因为今年有很多的调研阶段的产品线 Demo 发布，持续部署、接口文档以及线上质量监控这三个问题愈发突出。本文则主要针对接口文档的实时发布进行一些探讨；在前后端分离的今天，即使是由单人纵向负责某个业务流，也需要将前后端交互的接口规范清晰地定义并且发布，以保证项目的透明性与可维护性。理想的开发流程中，应当在产品设计阶段确定好关键字段命名、数据库表设计以及接口文档；不过实际操作中往往因为业务的多变性以及人手的缺失，使得接口的定义并不能总是实时地在项目成员之间达成一致。如果要让开发人员在更改接口的同时花费额外精力维护一份开发文档，可能对于我司这样的小公司而言存在着很大的代价与风险。软件开发中存在着所谓 Single Source of Truth 的原则，我们也需要尽量避免文档与实际实现的不一致造成的团队内矛盾以及无用的付出。综上所述，我们希望能够在编写后台代码、添加注释的同时，能够自动地生成接口文档；笔者比较熟悉 Spring 中以注解方式添加 Swagger 文档的模式，不过 Java 库的抽象程度一般较高，用起来也不怎么顺手。笔者在编写我司[ node-server-boilerplate ](https://parg.co/bvx)根据自己的想法设计了 [swagger-decorator](https://parg.co/bv7)。此外，项目中使用 Flow 进行静态类型检测，并且遵循我司内部的[ JavaScript 编程样式指南](https://parg.co/bvM)。

我们可以使用 npm 或者 yarn 安装 swagger-decorator，需要注意的是，因为使用了注解，因此建议是配置 Webpack 与 Babel，不熟悉的同学可以直接参考[ node-server-boilerplate ](https://parg.co/bvx)：
```$xslt
$ yarn add swagger-decorator

# 依赖于 Babel 的 transform-decorators-legacy 转换插件来使用 Decorator
$ yarn add transform-decorators-legacy -D
```

安装完毕之后，我们需要对项目中使用的路由进行封装。目前笔者只是针对 koa-router 中的路由对象进行封装，未来若有必要可以针对其他框架的路由解决方案进行封装。我们首先需要做的就是在路由定义之前使用 `wrappingKoaRouter` 函数修饰 router 对象：

```javascript
import { wrappingKoaRouter } from "swagger-decorator";

...

const Router = require("koa-router");

const router = new Router();

wrappingKoaRouter(router, "localhost:8080", "/api", {
  title: "Node Server Boilerplate",
  version: "0.0.1",
  description: "Koa2, koa-router,Webpack"
});

//定义默认的根路由
router.get("/", async function(ctx, next) {
  ctx.body = { msg: "Node Server Boilerplate" };
});

//定义用户处理路由
router.scan(UserController);

```

该函数的参数说明如下，对于 `info` 的结构参考[这里](http://swagger.io/docs/specification/basic-structure/)：

```javascript
/**
 * Description 将 router 对象的方法进行封装
 * @param router 路由对象
 * @param host API 域名
 * @param basePath API 基本路径
 * @param info 其他的 Swagger 基本信息
 */
export function wrappingKoaRouter(
  router: Object,
  host: string = "localhost",
  basePath: string = "",
  info: Object = {}
) {}
```

值得一提的是，在封装 `router` 时，笔者自定义了 `scan` 方法，其能够根据自动遍历目标类中的自定义方法，有点类似于 Java 中的 `ComponentScan`：

```javascript

/**
* Description 扫描某个类中的所有静态方法，按照其注解将其添加到
* @param staticClass
*/
router.scan = function(staticClass: Function) {
    let methods = Object.getOwnPropertyNames(staticClass);
    
    // 移除前三个属性 constructor、name
    methods.shift();
    methods.shift();
    methods.shift();
    
    for (let method of methods) {
      router.all(staticClass[method]);
    }
};

```

准备工作完成之后，我们即可以开始定义具体的接口控制器；笔者不喜欢过多的封装，因此这里选用了类的静态方法来定义具体的接口函数，整个 Controller 也只是朴素函数。下面笔者列举了常见的获取全部用户列表、根据用户编号获取用户详情、创建新用户这几个接口的文档注释方式：

```javascript
import {
  apiDescription,
  apiRequestMapping,
  apiResponse,
  bodyParameter,
  pathParameter,
  queryParameter
} from "swagger-decorator";
import User from "../entity/User";

/**
 * Description 用户相关控制器
 */
export default class UserController {
  @apiRequestMapping("get", "/users")
  @apiDescription("get all users list")
  @apiResponse(200, "get users successfully", [User])
  static async getUsers(ctx, next): [User] {
    ...
  }

  @apiRequestMapping("get", "/user/:id")
  @apiDescription("get user object by id, only access self or friends")
  @pathParameter({
    name: "id",
    description: "user id",
    type: "integer"
  })
  @queryParameter({
    name: "tags",
    description: "user tags, for filtering users",
    required: false,
    type: "array",
    items: ["string"]
  })
  @apiResponse(200, "get user successfully", User)
  static async getUserByID(ctx, next): User {
    ...
  }

  @apiRequestMapping("post", "/user")
  @apiDescription("create new user")
  @bodyParameter({
    name: "user",
    description: "the new user object, must include user name",
    required: true,
    schema: User
  })
  @apiResponse(200, "create new user successfully", {
    status_code: "200"
  })
  static async postUser(): number {
    ...
  }
}

```

在对接口注解的时候，我们需要用实体类指明返回值或者请求体中包含的参数信息，因此我们也需要使用 swagger-decorator 提供的 `entityProperty` 注解来为实体类添加描述。值得一提的是，这里我们支持直接将 Object 作为描述对象的返回值，算是避免了 Java 中的一大痛点。

```javascript
// @flow

import { entityProperty } from "swagger-decorator";
/**
 * Description 用户实体类
 */
export default class User {
  // 编号
  @entityProperty({
    type: "integer",
    description: "user id, auto-generated",
    required: false
  })
  id: string = 0;

  // 姓名
  @entityProperty({
    type: "string",
    description: "user name, 3~12 characters",
    required: true
  })
  name: string = "name";

  // 朋友列表
  friends: [number] = [1];

  // 属性
  properties: {
    address: string
  } = {
    address: "address"
  };
}

```

对于没有添加注解的属性，swagger-decorator 会自动根据其默认值来推测类型。然后我们就可以正常地启动应用，swagger-decorator 已经自动地为 `router` 对象添加了两个路由，其中 `/swagger` 指向了 Swagger UI：

![](https://coding.net/u/hoteam/p/Cache/git/raw/master/2017/6/1/WX20170617-172651.png)

而 `/swagger/api.json` 指向了 Swagger 生成的 JSON 文档：

![](https://coding.net/u/hoteam/p/Cache/git/raw/master/2017/6/1/WX20170617-172707.png)

欢迎有兴趣的朋友提出 ISSUE、指导意见或者希望纳入的特性。


# Application Features

![](https://camo.githubusercontent.com/605ebdcd920c801b875307d04b797a8eb4c81391/687474703a2f2f692e696d6775722e636f6d2f464445735a45432e706e67)


## File Directory

## Router

### Auth

## Controller

### Serve Static Files

## Model

### Service

## Logger

这里建议使用[winston](https://github.com/winstonjs/winston)作为主要的日志记录工具。

# Development Features

## Swagger

## Build & Deploy

使用`npm run build`构建打包之后的文件,使用`npm run deploy`同时打包与部署项目。这里建议使用[pm2](https://github.com/Unitech/pm2)作为集群部署工具,可以使用`npm run deploy`直接编译并且启动具有四个实例的集群。关于pm2详细的命令为:
```
# General
$ npm install pm2 -g            # Install PM2
$ pm2 start app.js              # Start, Daemonize and auto-restart application (Node)
$ pm2 start app.py              # Start, Daemonize and auto-restart application (Python)
$ pm2 start npm -- start        # Start, Daemonize and auto-restart Node application

# Cluster Mode (Node.js only)
$ pm2 start app.js -i 4         # Start 4 instances of application in cluster mode
                                # it will load balance network queries to each app
$ pm2 reload all                # Zero Second Downtime Reload
$ pm2 scale [app-name] 10       # Scale Cluster app to 10 process

# Process Monitoring
$ pm2 list                      # List all processes started with PM2
$ pm2 monit                     # Display memory and cpu usage of each app
$ pm2 show [app-name]           # Show all informations about application

# Log management
$ pm2 logs                      # Display logs of all apps
$ pm2 logs [app-name]           # Display logs for a specific app
$ pm2 logs --json               # Logs in JSON format
$ pm2 flush
$ pm2 reloadLogs

# Process State Management
$ pm2 start app.js --name="api" # Start application and name it "api"
$ pm2 start app.js -- -a 34     # Start app and pass option "-a 34" as argument
$ pm2 start app.js --watch      # Restart application on file change
$ pm2 start script.sh           # Start bash script
$ pm2 start app.json            # Start all applications declared in app.json
$ pm2 reset [app-name]          # Reset all counbters
$ pm2 stop all                  # Stop all apps
$ pm2 stop 0                    # Stop process with id 0
$ pm2 restart all               # Restart all apps
$ pm2 gracefulReload all        # Graceful reload all apps in cluster mode
$ pm2 delete all                # Kill and delete all apps
$ pm2 delete 0                  # Delete app with id 0

# Startup/Boot management
$ pm2 startup                   # Generate a startup script to respawn PM2 on boot
$ pm2 save                      # Save current process list
$ pm2 resurrect                 # Restore previously save processes
$ pm2 update                    # Save processes, kill PM2 and restore processes
$ pm2 generate                  # Generate a sample json configuration file

# Deployment
$ pm2 deploy app.json prod setup    # Setup "prod" remote server
$ pm2 deploy app.json prod          # Update "prod" remote server
$ pm2 deploy app.json prod revert 2 # Revert "prod" remote server by 2

# Module system
$ pm2 module:generate [name]    # Generate sample module with name [name]
$ pm2 install pm2-logrotate     # Install module (here a log rotation system)
$ pm2 uninstall pm2-logrotate   # Uninstall module
$ pm2 publish                   # Increment version, git push and npm publish
```
![](https://github.com/unitech/pm2/raw/master/pres/pm2-list.png)

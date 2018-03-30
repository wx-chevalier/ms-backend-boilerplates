> [利用 create-spring-boot-app 快速创建 Spring Boot 应用](https://zhuanlan.zhihu.com/p/25974673) 从属于笔者的 [服务端应用程序开发与系统架构](https://github.com/wxyyxc1992/ServerSideApplication-Development-And-System-Architecture)。最近一段时间我司业务快速扩展，针对不同的项目分割了很多代码库，为了方便新同事学习与快速使用 Spring Boot 项目，顺手将之前的模板整合为 [create-spring-boot-app](https://github.com/wxyyxc1992/create-spring-boot-app)，跟笔者之前的 [create-react-boilerplate](https://github.com/wxyyxc1992/create-react-boilerplate) 都是属于脚手架系列。
更多编程语言、服务端开发方面的知识图谱参考 [2016: 我的技术体系结构图](https://zhuanlan.zhihu.com/p/24476917)、[探究高可用服务端架构的优秀资料索引](https://zhuanlan.zhihu.com/p/25820192)、[追求技术之上的进阶阅读学习索引](https://zhuanlan.zhihu.com/p/25642783) 、 [机器学习、深度学习与自然语言处理领域推荐的书籍列表](https://zhuanlan.zhihu.com/p/25612011)。

# 利用 create-spring-boot-app 快速创建 Spring Boot 应用

如果你尚未安装 Node.js 环境，推荐使用 [nvm](https://github.com/creationix/nvm) 安装 Node.js 基本环境。如果你尚未安装 Java 或者 Gradle，推荐使用 [sdkman](sdkman.io) 安装 Java/Gradle。基本环境安装完毕之后可以使用 npm 安装脚手架：
```
npm install create-spring-boot-app -g
```
安装完毕后，可以查看常用命令：
```
➜  ~ create-spring-boot-app -h

  Usage: create-spring-boot-app <project-name> [options]

  Options:

    -h, --help               output usage information
    -V, --version            output the version number
    -p, --package [package]  选择包名（默认 wx.csba）
    -t, --type [type]        选择模板类型 [gradle/maven]
    -a, --addon [addon]      选择所需要的扩展，多个以逗号隔开 [all/weixin]

    仅 <project-name> 是必须参数！
```

我们现在可以使用 create-spring-boot-app 直接创建新的 Spring Boot 项目：
```
➜  ~ create-spring-boot-app testtest -p com.test
开始创建新的 Spring Boot 应用位于文件夹 /Users/apple/testtest
初始化 testtest 基于 gradle-boilerplate
开始抓取远端模板 https://github.com/wxyyxc1992/create-spring-boot-app
将包名更为：com.test
应用创建完毕

使用 cd testtest 进入项目文件夹
使用 gradle :help 查看可用命令
```

进入到项目目录下，我们可以查看可用命令：
```
➜  testtest gradle :help
Starting a Gradle Daemon, 25 stopped Daemons could not be reused, use --status for details
:help
使用 gradle :bootRun 运行 Spring Boot 项目（这里的 : 表示从根模块开始运行）
使用 gradle :build 打包 Jar
使用 gradle task 查看所有任务

BUILD SUCCESSFUL

Total time: 3.966 secs
```

然后使用 `gradle :bootRun` 命令启动服务器，然后打开 `localhost:8081` 即可查看基本的访问返回。为了保证应用具有热加载功能，我们使用 [Spring Loaded](http://docs.spring.io/spring-boot/docs/current/reference/html/howto-hotswapping.html) 插件：

```groovy
buildscript {
    repositories { jcenter() }
    dependencies {
        classpath "org.springframework.boot:spring-boot-gradle-plugin:1.5.2.RELEASE"
        classpath 'org.springframework:springloaded:1.2.6.RELEASE'
    }
}

apply plugin: 'idea'

idea {
    module {
        inheritOutputDirs = false
        outputDir = file("$buildDir/classes/main/")
    }
}

// ...
```
该插件在笔者的 Java 8u121 版本中是会报异常，正在尝试解决中。

# 目录结构

```
- spring-boot-app
    - src
        - application
    - module
        - api    
            - controller
            - logic
            - graphql
        - shared
            - entity
            - util
        - model
            - rds
            - kv
        - service
    - addon
        - weixin
```

各个模块之间独立可测试，模块间尽量显式依赖；不过这些模块并非强制分组，对于初期应用也可以选择不进行分模块，全部代码写在根应用中。模块之间的依赖关系如下：

![](https://coding.net/u/hoteam/p/Cache/git/raw/master/2017/3/1/SpringBootApplication.png)




# 共享模块

## 实体类

实体类推荐使用 [Lombok](https://projectlombok.org/features/index.html) 进行实时封装。Lombok主要依赖编译时代码生成技术，帮你自动生成基于模板的常用的 Java 代码，譬如最常见的 Getter 与 Setter 。之前动态的插入 Getter 与 Setter 主要有两种，一个是像 Intellij 与 Eclipse 这样在开发时动态插入，缺点是这样虽然不用你手动写，但是还是会让你的代码异常的冗长。另一种是通过类似于 Spring 这样基于注解的在运行时利用反射动态添加，不过这样的缺陷是会影响性能，并且有一定局限性。笔者目前用的开发环境是 Intellij+Gradle，这里只介绍下这种搭建方式，其他的基于 Eclipse 或者 Maven 的可以到官网主页查看。
（1）在 Intellij 中添加 Plugin
- Go to `File > Settings > Plugins`
- Click on `Browse repositories...`
- Search for `Lombok Plugin`
- Click on `Install plugin`
- Restart Android Studio

（2）允许注解处理
- Settings -> Compiler -> Annotation Processors

（3）Gradle中添加依赖（默认已经添加）
```
compile "org.projectlombok:lombok:1.12.6"
```

# 数据接口

## 接口风格

接口推荐使用 RESTful 与 ActionBased 风格的接口，对于复杂查询可以考虑使用 GraphQL 风格的查询语言进行二次封装。不过在应用服务器本身应该尽可能地提供原子化的接口，特别是在快速迭代的产品开发中，在需求稳定之前后台应该尽可能地提供细粒度的接口让前端自由封装。可以参考 [来自于PayPal的RESTful API标准](https://segmentfault.com/a/1190000005924733)、[Google API Design Guide](https://cloud.google.com/apis/design/) 等。

## 逻辑与副作用分离

笔者特意设置了 logic 包，应将业务逻辑抽象为纯函数的方式放置到 logic 包中，方便测试与复用。

# 数据持久化

项目中计划使用 Mybatis 作为半自动的数据持久化工具，使用 Mybatis Generator 作为代码自动生成工具。

# 微服务
 
## HTTPS 与负载均衡

推荐是所有的对外开放的接口全部使用 HTTPS 连接，但是不建议直接在应用服务器上添加 HTTPS 证书和支持；可以使用 Nginx/Caddy 这样的 Web 服务器进行反向代理与负载均衡操作，更多信息参考 [清新脱俗的 Web 服务器 Caddy](https://zhuanlan.zhihu.com/p/25850060) 、[Nginx 基本配置备忘](https://zhuanlan.zhihu.com/p/24524057)。

## 服务状态监听

项目中使用了 [actuator-service](https://spring.io/guides/gs/actuator-service/) 监听服务运行状态，需要在依赖中添加 `compile("org.springframework.boot:spring-boot-starter-actuator")`，然后在配置文件中指定监听地址：
```
management.port=8082
management.address=127.0.0.1
```
在应用启动后，访问 `/health` 即可以获取到系统当前信息：
```
{
    status: "UP",
    diskSpace: {
        status: "UP",
        total: 249804890112,
        free: 27797606400,
        threshold: 10485760
        }
}
```

# 测试

## 单元测试

单元测试的目标是某个单独类或者函数的功能，应该尽可能地通过 Mock 等技术隔离测试环境，譬如我们要测试某个接口：
```
@RunWith(SpringRunner.class)
@WebMvcTest(IndexController.class)
public class IndexControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void greetingShouldReturnMessageFromService() throws Exception {
        this.mockMvc.perform(get("/")).andDo(print()).andExpect(status().isOk())
                .andExpect(content().string(containsString("Hello Mock")));
    }

}
```

## 集成测试
在集成测试中我们需要尽量模拟真实环境，测试多个模块间的互动；譬如在单元测试中我们会 Mock 数据库连接、外部服务等，但是在集成测试中我们的测试目标仍然是单元功能点，但是会测试其在真实环境下的多模块耦合的功能表现。

## 端到端测试
端到端测试相对而言属于黑盒测试，我们往往对部署在生产环境下的应用服务测试其可用性与逻辑准确性。


## 扩展

`/addon` 目录下存放的是某些可复用的业务扩展代码，典型的譬如微信后台，包括微信登录、微信支付等常用功能；开发者可以使用 `-a` 选项来选择初始化时需要的扩展模板，默认是全部扩展都会被添加进来。

- 微信：我的微信SDK，包括公众平台管理、微信支付等各个版本。老实说,微信的文档并不是很友好,坑不少啊~~ 笔者在这里准备的算是半自动化的。参考 [这里](https://github.com/wxyyxc1992/create-spring-boot-app/Weixin.md) 查看具体的功能描述与代码说明

# Roadmap

笔者拟计划未来添加以下特性：
- 继续完成常用功能
- 类似于 Rails 的代码自动生成
- 嵌入的常见 Java 调试工具

欢迎大家提出建议、需求与 PR
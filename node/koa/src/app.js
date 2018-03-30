// @flow

const Koa = require("koa");
const cors = require('kcors');
const argv = require("minimist")(process.argv.slice(2));

import router from "./application/router";
import { auth, header, logger } from "./application/middleware/middleware";

const app = new Koa();

// 添加 CORS 支持
app.use(cors());

//设置请求与响应的通用头
header(app);

//设置日志记录工具
logger(app);

//配置认证信息
auth(app);

// 设置路由配置信息
app.use(router.routes()).use(router.allowedMethods());

// 定义默认的监听地址
// 判断是否有输入监听地址
let domain = argv.domain || "0.0.0.0";

// 判断是否有输入监听端口
let port = argv.port || 8080;

//封装最后的完整的地址
const applicationUrl = "http://" + domain + ":" + port;

//打印监听端口
console.log(applicationUrl);

// Start the web server
app.listen(port);

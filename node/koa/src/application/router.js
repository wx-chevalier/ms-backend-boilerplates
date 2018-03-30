// @flow

import UserController from "../business/controller/UserController";
import { serveStatic } from "../business/controller/StaticController";
import { wrappingKoaRouter } from "swagger-decorator";
import { graphqlKoa, graphiqlKoa } from 'apollo-server-koa';
import {graphqlSchema} from "../business/graphql/schema";
const koaBody = require('koa-body');

const Router = require("koa-router");

const router = new Router();

// koaBody is needed just for POST.
router.post('/graphql', koaBody(), graphqlKoa({ schema: graphqlSchema }));
router.get('/graphql', graphqlKoa({ schema: graphqlSchema }));

router.post('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }));
router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }));

// 封装原有的 koa-router 对象
wrappingKoaRouter(router, "localhost:8080", "/api", {
  title: "Node Server Boilerplate",
  version: "0.0.1",
  description: "Koa2, koa-router,Webpack"
});

// 定义默认的根路由
router.get("/", async function(ctx, next) {
  ctx.body = { msg: "Node Server Boilerplate" };
});

//定义用户处理路由
router.scan(UserController);

//定义全局静态文件支持路由
router.get("/static/*", serveStatic("./static"));

//默认导出路由配置
export default router;

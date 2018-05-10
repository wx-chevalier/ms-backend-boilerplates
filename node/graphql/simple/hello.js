const { graphql, buildSchema } = require('graphql');

// 使用 GraphQL schema language 定义 Schema
const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// 为每个 API 端点提供解析函数
const root = {
  hello: () => {
    return 'Hello world!';
  }
};

// 执行查询请求，并且获取结果
graphql(schema, '{ hello }', root).then(response => {
  console.log(response);
});

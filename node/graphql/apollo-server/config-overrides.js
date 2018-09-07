/* eslint-disable */
module.exports = function override(config, env) {
  var path = require('path')

  // workaround for https://github.com/apollographql/apollo-client/issues/1237
  config.resolve.modules.push(path.resolve(__dirname, 'node_modules', 'apollo-client'))

  // add graphql loader
  config.module.rules[1].oneOf.unshift({
    test: /\.(graphql|gql)$/,
    exclude: /node_modules/,
    loader: 'graphql-tag/loader'
  })

  return config
}

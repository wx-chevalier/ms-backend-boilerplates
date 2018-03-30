'use strict';

const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

const nodeModules = {};

//遍历所有的NodeModules以防止意外引入
fs.readdirSync('node_modules')
  .filter(function (x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function (mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

//设置基本的模块导入导出规范
module.exports = {
  entry: './src/app.js',
  target: 'node',
  output: {
    path: path.join(__dirname, '../dist'),
    filename: 'app.bundle.js'
  },
  externals: nodeModules,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      }
    ]
  },
  plugins: [
    //忽略所有的CSS与LESS文件
    new webpack.IgnorePlugin(/\.(css|less)$/),
  ],
  devtool: 'sourcemap'
};

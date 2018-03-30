#!/usr/bin/env node
"use strict";

/**
 * Copyright (c) 2015-present, 王下邀月熊, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

var chalk = require("chalk");
var commander = require("commander");
var fs = require("fs-extra");
var path = require("path");
var spawn = require("cross-spawn");
var semver = require("semver");
var clone = require("git-clone");
var replace = require("replace");

var currentNodeVersion = process.versions.node;

// 判断当前 Node 版本是否过低
if (currentNodeVersion.split(".")[0] < 4) {
  console.error(
    chalk.red(
      "当前 Node 版本为 " +
        currentNodeVersion +
        ".\n" +
        "本工具依赖于 Node 4.0 及以上版本\n" +
        "请更新你的 Node 版本"
    )
  );
  process.exit(1);
}

// 项目名
var projectName;

var program = commander
  .version(require("./package.json").version)
  .arguments("<project-name>")
  .usage(chalk.green("<project-name>") + " [options]")
  .action(function(name) {
    projectName = name;
  })
  .option("-p, --package [package]", "选择包名（默认 wx.csba）", "wx.csba")
  .option("-t, --type [type]", "选择模板类型 [gradle/maven]", "gradle")
  .option("-a, --addon [addon]", "选择所需要的扩展，多个以逗号隔开 [all/weixin]", "all")
  .allowUnknownOption()
  .on("--help", function() {
    console.log("    仅 " + chalk.green("<project-name>") + " 是必须参数！");
    console.log();
  })
  .parse(process.argv);

// 判断是否有输入参数，否则报错
if (!process.argv.slice(2).length) {
  program.outputHelp(function(txt) {
    return chalk.red(txt);
  });
}

// 如果用户尚未输入项目名，直接报错
if (typeof projectName === "undefined") {
  console.error("请选择项目目录名:");
  console.log(
    "  " + chalk.cyan(program.name()) + chalk.green(" <project-name>")
  );
  console.log();
  console.log("譬如:");
  console.log(
    "  " + chalk.cyan(program.name()) + chalk.green(" my-spring-boot-app")
  );
  console.log();
  console.log("允许 " + chalk.cyan(program.name() + " --help") + " 查看所有选项");
  process.exit(1);
}

// 获取到包名
var packageName = program.package;

// 获取到选定要使用的扩展
var addon = program.addon;

createApp(projectName, program.type);

/**
 * @function 创建应用
 * @param name
 * @param type
 */
function createApp(name, type) {
  var root = path.resolve(name);
  var appName = path.basename(root);

  // 检测文件名是否可用
  checkAppName(appName);

  // 判断文件夹是否可以覆盖
  fs.ensureDirSync(name);

  if (!isSafeToCreateProjectIn(root)) {
    console.log("目录 " + chalk.green(name) + " 包含冲突文件");
    console.log("请使用新的目录名");
    process.exit(1);
  }

  console.log("开始创建新的 Spring Boot 应用位于文件夹 " + chalk.green(root) + "");

  // 当前目录
  var originalDirectory = process.cwd();
  process.chdir(root);

  console.log(
    "初始化 " +
      chalk.green(appName) +
      " 基于 " +
      chalk.cyan(type + "-boilerplate") +
      ""
  );

  console.log("开始抓取远端模板 " + chalk.green("https://github.com/wxyyxc1992/create-spring-boot-app"));

  // git clone 远端代码
  clone(
    "https://git.coding.net/hoteam/create-spring-boot-app.git",
    ".tmp",
    {
      checkout:'master'
    },
    function() {

      // 移动出模板文件
      fs.copySync("./.tmp/gradle-boilerplate", "./");

      // 移除 .tmp
      fs.removeSync(".tmp");

      console.log("将包名更为：" + packageName);

      // 替换文件中所有的类名
      replace({
        regex: "wx.csba",
        replacement: packageName,
        paths: ["."],
        recursive: true,
        silent: true
      });

      var sourceSets = [
        "./src/main/java",
        "./src/main/resources",
        "./module/api/src/main/java",
        "./module/api/src/main/resources",
        "./module/model/src/main/java",
        "./module/model/src/main/resources",
        "./module/service/src/main/java",
        "./module/service/src/main/resources",
        "./module/shared/src/main/java",
        "./module/shared/src/main/resources"
      ];

      sourceSets.forEach(function(sourceSet) {
        // 保证源文件存在
        fs.ensureDirSync(sourceSet + "/wx/csba");
        
        var target = packageName.replace("\.","/");

        // 重命名根文件目录名
        fs.moveSync(sourceSet + "/wx/csba/", sourceSet + "/" + target);

        // 移除源目录
        fs.removeSync(sourceSet + "/wx");
        
      });

      console.log("应用创建完毕 \n");
      console.log("使用 " + chalk.green("cd " + appName) + " 进入项目文件夹");
      console.log("使用 " + chalk.green("gradle :help") + " 查看可用命令");
    }
  );
}

/**
 * @function 检测 APP 名称
 * @param appName
 */
function checkAppName(appName) {
  // TODO: there should be a single place that holds the dependencies
  var dependencies = ["react", "react-dom"];
  var devDependencies = ["chalk"];
  var allDependencies = dependencies.concat(devDependencies).sort();

  if (allDependencies.indexOf(appName) >= 0) {
    console.error(
      chalk.red(
        "无法创建名为 " +
          chalk.green(appName) +
          " 的项目，因为已经存在同名文件夹\n"
      ) +
        chalk.cyan(
          allDependencies
            .map(function(depName) {
              return "  " + depName;
            })
            .join("\n")
        ) +
        chalk.red("\n\n请输入其他名称")
    );
    process.exit(1);
  }
}

// If project only contains files generated by GH, it’s safe.
// We also special case IJ-based products .idea because it integrates with CRA:
// https://github.com/facebookincubator/create-react-app/pull/368#issuecomment-243446094
function isSafeToCreateProjectIn(root) {
  var validFiles = [
    ".DS_Store",
    "Thumbs.db",
    ".git",
    ".gitignore",
    ".idea",
    "README.md",
    "LICENSE"
  ];
  return fs.readdirSync(root).every(function(file) {
    return validFiles.indexOf(file) >= 0;
  });
}

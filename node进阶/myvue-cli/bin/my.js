#!/usr/bin/env node
//指定解释器  在package中bin选项中指定命令 执行脚本
//npm link 将本地包进行全局安装

const progarm =require("commander") //定制命令行界面
//执行的策略
progarm.version(require("../package").version)//require会自动加载json类型
progarm.command("create <name>")//命令行create后的参数会解析到name变量中去
.description("create project")
.action(require("../lib/create"))//拿到命令行参数后执行的操作
progarm.command("refresh")
.description("refresh routers ...")
.action(require("../lib/refresh"))

progarm.parse(process.argv)//通过读取命令行的参数来实现 process是主进程
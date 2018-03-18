#!/usr/bin/env node

// todo
// * 使用现有库，实现 --help，等标准命令附加功能

// 获取nodejs命令的参数
// 前两个参数默认传递，不需要考虑
var [
  nodePath,
  nodeScriptPath,
  secondArg,
  thirdArg
] = process.argv

// 执行指定的 command，不依赖 yo 命令
var env = require('yeoman-environment').createEnv()
  .register(require.resolve('../generators/scaffold'), 'scaffold')
  .register(require.resolve('../generators/publish'), 'publish')
  .register(require.resolve('../generators/config'), 'config')

// bscpm create:cmp
// 创建组件脚手架
if (secondArg === 'create:cmp') {
  env.run('scaffold Component')
}

// 发布组件命令
if (secondArg === 'publish') {
  env.run('publish') 
}

// 提供给开发者用于配置本地config的命令
if (secondArg === 'set') {
  env.run(`config ${thirdArg}`)
}

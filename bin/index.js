#!/usr/bin/env node

// todo
// * 使用现有库，实现 --help，等标准命令附加功能

// 获取nodejs命令的参数
// 前两个参数默认传递，不需要考虑
var [
  nodePath,
  nodeScriptPath,
  secondCmd
] = process.argv

// 执行指定的 command，不依赖 yo 命令
var env = require('yeoman-environment').createEnv()
  .register(require.resolve('../generators/scaffold'), 'scaffold')

// bscpm create:cmp
if (secondCmd === 'create:cmp') {
  env.run('scaffold Component')
}

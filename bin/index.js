#!/usr/bin/env node

// 结合使用commander强大的命令行框架
const program = require('commander')
const yeomanEnv = require('yeoman-environment')
const upgradeMsg = require('../src/upgrade-msg')
const pckJson = require('../package.json')

// 加载yeoman命令，初始化
const env = yeomanEnv.createEnv()
  .register(require.resolve('../src/create'), 'create')
  .register(require.resolve('../src/run'), 'run')

program
  .version(pckJson.version, '-v, -V, --version')

// 脚手架
program
  .command('create')
  .description('脚手架工具生成解决方案')
  .action(async () => {
    await upgradeMsg()
    env.run('create component')
  })

program
  .command('run <cmd>')
  .description('组件构建相关的命令：build, build-after-notice, build-storybook, check, docgen, login, publish, rcgen, record, rsync-statics')
  .option('-f, --force', '强制命令')
  .option('-c, --cinumber', 'Jenkins构建任务的编号')
  .option('-j, --jobname', 'Jenkins构建任务名')
  .option('-t, --to', '邮件发送地址')
  .option('-s, --status', 'Jenkins构建任务状态')
  .action((cmd, opts) => {
    env.run(`run ${cmd}`, opts)
  })

program.parse(process.argv)

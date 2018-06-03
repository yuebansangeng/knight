#!/usr/bin/env node

// 结合使用commander强大的命令行框架
const program = require('commander')
const yeomanEnv = require('yeoman-environment')
const jsonlint = require('jsonlint')
const path = require('path')
const fs = require('fs')
const request = require('request')
const colors = require('colors')
const { spawnSync } = require('child_process')
const npmCliLogin = require('@beisen/npm-cli-login')

// 加载yeoman命令，初始化
const env = yeomanEnv.createEnv()
  .register(require.resolve('../src/create'), 'create')
  .register(require.resolve('../src/publish'), 'publish')
  .register(require.resolve('../src/config'), 'config')
  .register(require.resolve('../src/link'), 'link')
  .register(require.resolve('../src/run'), 'run')

// 获取当前模块的版本，初始化
let pckContent = fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8')
let pckJson = jsonlint.parse(pckContent)
program.version(pckJson.version)

// 检测是否有新的版本，建议升级
const upgradeMsg = () => {
  // let { status, stdout } = spawnSync('npm', [ 'show', pckJson.name, 'version' ])
  // let lastVersion = stdout.toString().replace(/^\s+|[\s\n\r]+$/, '')
  // if (pckJson.version !== lastVersion) {
  //   console.log('@beisen/bscpm 已有新的版本'.magenta)
  // }
}

// 脚手架
program
  .command('create [solution]')
  .option('-c, --component', '创建组件项目')
  .option('-s, --storybook', '输出storybook的配置，往往因默认配置无法满足')
  .description('脚手架工具生成解决方案')
  .action((solution, opts) => {
    upgradeMsg()    
    if (solution) {
      switch (solution) {
        case 'component':
          env.run('create Component', { 'printStorybookConfig': opts.storybook })
          break
        default: break
      }  
    } else {
      // 开发者可以使用 -c 替换掉 component
      if (opts.component) {        
        env.run('create Component', { 'printStorybookConfig': opts.storybook })
      }
    }
  })

// 组件发布
program
  .command('publish')
  .option('-f, --force', '强制发布组件')
  .option('-b, --rebuild', '发布前，重新构建组件源码')
  .option('-n, --npmOnly', '只发布组件到NPM上')
  .option('-p, --npmPublish', '组件自动发布到npm')
  .description('发布组件')
  .action(opts => {
    upgradeMsg()
    env.run('publish', {
      'force': opts.force,
      'rebuild': opts.rebuild,
      'login': opts.login,
      'npmOnly': opts.npmOnly,
      'dataOnly': opts.dataOnly,
      'npmPublish': opts.npmPublish
    })
  })

program
  .command('run <cmd> [arg1]')
  .description('执行本地调试的命令')
  .action((cmd, arg1) => {
    upgradeMsg()
    switch (cmd) {
      case 'examples':
        env.run(`run examples`)
        break
      case 'build':
        env.run(`run build`)
        break
      case 'prefixing-name':
        env.run(`run prefixing-name`)
        break
      case 'check-cmp':
        env.run(`run check-cmp`)
        break
      case 'update-version':
        env.run('run update-version', {
          'version': arg1
        })
        break
      default: break
    }  
  })

// 配置环境参数
program
  .command('set <param>')
  .description('配置环境参数')
  .action(param => {
    upgradeMsg()
    env.run(`config ${param}`)
  })

// 组件登录，服务端使用
program
  .command('login')
  .description('登录NPM账号，模块发布前操作')
  .action(opts => {
    upgradeMsg()
    // 配置 process.env
    // 从本项目中加载 .env 配置
    let dotenvs = require('dotenv').config({ 'path': path.join(__dirname, '..', '.env') })
    if (dotenvs.error) {
      throw dotenvs.error
    }
    // 环境中获取提前配置好的 npm 账号
    let {
      'CMP_BUILDER_NPM_NAME': name,
      'CMP_BUILDER_NPM_PASS': password,
      'CMP_BUILDER_NPM_EMAIL': email
    } = process.env
    if (!name) {
      throw new Error('需要在jenkins服务器，配置账号登录信息')
    }
    // 使用登录模块登录，主要是为了实现一键登录
    npmCliLogin({ 'user': name, 'pass': password, email }, () => {
      console.log('NPM 账号登录成功')
    })
  })

program
  .command('link <dest>')
  .option('-u, --unlink', '删除调试链接')
  .description('创建/删除 node_modules 中模块的调试环境')
  .action((param, opts) => {
    upgradeMsg()
    env.run(`link`, {
      'destProject': param,
      'unlink': opts.unlink
    })
  })

program.parse(process.argv)

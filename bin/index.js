#!/usr/bin/env node

// 结合使用commander强大的命令行框架
const program = require('commander')
const yeomanEnv = require('yeoman-environment')
const jsonlint = require('jsonlint')
const path = require('path')
const fs = require('fs')
const request = require('request')
const npmCliLogin = require('@beisen/npm-cli-login')
const colors = require('colors')
const { spawn } = require('child_process')

// 加载yeoman命令，初始化
const env = yeomanEnv.createEnv()
  .register(require.resolve('../src/scaffold-solutions'), 'scaffold')
  .register(require.resolve('../src/publish'), 'publish')
  .register(require.resolve('../src/config'), 'config')
  .register(require.resolve('../src/link'), 'link')

// 获取当前模块的版本，初始化
let pckContent = fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8')
let pckJson = jsonlint.parse(pckContent)
program.version(pckJson.version)

// 检测是否有新的版本，建议升级
const upgradeMsg = () => {
  let s_process = spawn('npm', [ 'show', pckJson.name, 'version' ])
  s_process.stdout.on('data', data => {
    if (pckJson.version !== data) {
      console.log('bscpm已有新的版本，建议升级'.yellow)
    }
  })
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
          env.run('scaffold Component', { 'printStorybookConfig': opts.storybook })
          break
        case 'project':
          env.run('scaffold Project')
          break
        default: break
      }  
    } else {
      // 开发者可以使用 -c 替换掉 component
      if (opts.component) {
        env.run('scaffold Component', { 'printStorybookConfig': opts.storybook })
      }
    }
  })

// 组件发布
program
  .command('publish')
  .option('-f, --force', '强制发布组件')
  .option('-b, --rebuild', '发布前，重新构建组件源码')
  .option('-n, --npmOnly', '只发布组件到NPM上')
  .description('发布组件')
  .action(opts => {
    upgradeMsg()
    env.run('publish', {
      'force': opts.force,
      'rebuild': opts.rebuild,
      'login': opts.login,
      'npmOnly': opts.npmOnly
    })
  })

// 组件发布
program
  .command('login')
  .description('登录账号')
  .action(opts => {
    upgradeMsg()
    // 获取账号信息，临时
    request(`http://shared-cmps.beisen.co/users/get-publish-account`, (err, response, body) => {
      if (err) {
        return console.log(`NPM登录失败: ${err}`)
      }
      // 登录开始
      let { name, password, email } = JSON.parse(body)
      npmCliLogin({ 'user': name, 'pass': password, email }, () => {
        console.log('Bscpm登录成功'.green)
      })
    })
  })

// 配置环境参数
program
  .command('set <param>')
  .description('发布组件')
  .action(param => {
    upgradeMsg()
    env.run(`config ${param}`)
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

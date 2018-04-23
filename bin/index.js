#!/usr/bin/env node

// 结合使用commander强大的命令行框架
const program = require('commander')
const yeomanEnv = require('yeoman-environment')
const jsonlint = require('jsonlint')
const path = require('path')
const fs = require('fs')
const shelljs = require('shelljs')


// 加载yeoman命令，初始化
const env = yeomanEnv.createEnv()
  .register(require.resolve('../src/scaffold-solutions'), 'scaffold')
  .register(require.resolve('../src/publish'), 'publish')
  .register(require.resolve('../src/config'), 'config')

// 获取当前模块的版本，初始化
let pckContent = fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8')
let pckJson = jsonlint.parse(pckContent)
program.version(pckJson.version)

// 更新模板
// program
//   .command('upgrade <obj>')
//   .description('更新')
//   .action(obj => {
//     switch (obj) {
//       case 'template':
//         shelljs.exec(`cd /usr/local/bin/${pckJson.name} && pwd`)
//         break
//       default: break
//     }
//   })

// 脚手架
program
  .command('create <solution>')
  .description('脚手架工具生成解决方案')
  .action((solution) => {
    switch (solution) {
      case 'Component':
        env.run('scaffold Component')
        break
      case 'Project':
        env.run('scaffold Project')
        break
      default: break
    }
  })

// 组件发布
program
  .command('publish')
  .description('发布组件')
  .action(() => {
    env.run('publish')
  })

// 配置环境参数
program
  .command('set <param>')
  .description('发布组件')
  .action(param => {
    env.run(`config ${param}`)
  })

program.parse(process.argv)

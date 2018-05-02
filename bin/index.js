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


// 脚手架
program
  .command('create [solution]')
  .option('-c, --component', '创建组件项目')
  .option('-s, --storybook', '输出storybook的配置，往往因默认配置无法满足')
  .description('脚手架工具生成解决方案')
  .action((solution, opts) => {
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

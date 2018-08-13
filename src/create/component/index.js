
import fs from 'fs'
import Generator from 'yeoman-generator'
import request from 'request'
import { spawnSync } from 'child_process'
import gitclone from './git-clone'
import { RCFileName } from '@beisen/read-rc'

export default class extends Generator {

  prompting() {
    let { username } = this.options

    // 如果为传递用户名，则自动获取，用于给Gitlab项目添加权限
    if (!username) {
      const { stdout } = spawnSync('git', ['config', 'user.name'])
      username = `${stdout}`.replace(/^\s+|\s+$/, '')
    }

    return this.prompt([
      {
        'type': 'input',
        'name': 'moduleName',
        'message': '组件名字 ( 可使用小写英文、数字、中划线 )：',
        'validate': function (value) {
          if (!value.match(/^[a-z\-\d]+?$/)) {
            return '组件名称格式不正确, 只能包含小写英文、数字、中划线'
          }
          return true;
        }
      },
      {
        'type': 'confirm',
        'name': 'isSyncGitlab',
        'message': '是否在gitlab上创建该项目',
        'default': true
      },
      {
        'type': 'input',
        'name': 'developers',
        'message': '开发者名称：',
        'default': username
      },
      {
        'type': 'input',
        'name': 'description',
        'message': '项目描述：'
      },
      {
        'type': 'input',
        'name': 'group',
        'message': '组件分组：',
        'when': function(answers) { // 当isSyncGitlab为true的时候才会提问当前问题
          return answers.isSyncGitlab
        }
      },
      {
        'type': 'input',
        'name': 'category',
        'message': '组件分类：'
      },
      {
        'type': 'input',
        'name': 'team',
        'message': '项目组：'
      },
      {
        'type': 'list',
        'name': 'device',
        'message': '设备名：',
        'choices': ['pc','mobile']
      }
    ]).then(promptes => {
      let { moduleName, developers, description, group, category, team, device } = promptes
      // if (!moduleName || !moduleName.match(/^[a-z\-\d]+?$/)) {
      //   throw new Error(`组件名称格式不正确：${moduleName}, 只能包含小写英文、数字、中划线`)
      // }
      this.promptes = promptes
      this.promptes.projectName = moduleName
      this.promptes.username = username
      this.promptes.group = group
      this.promptes.developers = developers
      this.promptes.description = description
      this.promptes.category = category
      this.promptes.team = team
      this.promptes.device = device
      this.promptes.repository = ''
    })
  }

  writing() {
    const { CMP_SERVER_HOST } = process.env
    let { projectName, username, isSyncGitlab, group } = this.promptes
    if (!isSyncGitlab) {
      // 创建目录
      if (!fs.existsSync(projectName)) {
        fs.mkdirSync(projectName)
      } else {
        // 文件夹中有文件，提示错误
        let files = fs.readdirSync(projectName).filter(filename => filename !== '.git')
        if (files.length) {
          return console.log(`fatal: destination path '${projectName}' already exists and is not an empty directory.\n`)
        }
      }
      // 创建、安装
      this._copyTemplateFiles()
      this._installPkg()
      return
    }

    request(`${CMP_SERVER_HOST}/users/create-project?project=${projectName}&username=${username}&group=${group}`, (err, resp, body) => {
      if (err) {
        throw new Error(`${'Error'.red} gitlab上已有该项目|项目创建失败`)
      }
      const { code, message, data = {} } = JSON.parse(body)

      // 如果接口中返回非200，异常，则提示错误
      if (code !== 200) {
        let msg = `${message}, 可能是username缺失，如果没有配置 git user.name，可使用 --username 添加Gitlab用户名`
        throw new Error(msg)
      }

      // 执行clone项目
      gitclone(5, data.group, projectName)
        .then(statue => {
          if (statue) {
            this._copyTemplateFiles()
            this._installPkg()
          } else {
            console.log('clone项目出现异常，请重试或手动操作')
          }
        })
    })
  }

  /*
  * 封装copy（API），减少代码量
  * 28原则：百分之20%的代码解决80%的功能
  * 函数名前面添加下滑线，告知Yeoman不自定执行改函数
  */
  _copyTemplateFiles() {
    this._private_copies([
      ['gitignore', '.gitignore'], // npm publish，会忽略 .gitignore 文件
      ['index.js', 'src/index.js'],
      ['example.js', 'examples/default/index.js'],
      ['npmignore', '.npmignore'],
      ['package.json'],
      ['README.md'],
      [RCFileName]
    ])
  }

  _installPkg() {
    // if (this.promptes.isSyncGitlab) {
    // 跳转至当前组件项目路径下
    process.chdir(`${this.promptes.projectName}`)
    // }

    this.npmInstall(['react@15.6.2', 'react-dom@15.6.2'])
    this.npmInstall(
      [
        '@beisen/storybook-lib@latest',
        '@beisen/gulp-lib@latest'
      ], {
        'save-dev': true
      }
    )
  }

  _private_copies(copyJobs = []) {
    copyJobs.forEach(([tplFilePath, destFilePath, tplData = {}]) => {
      if (!destFilePath) {
        destFilePath = tplFilePath
      }
      if (!tplFilePath) throw new Error('tplFilePath is none')
      if (!destFilePath) throw new Error('destFilePath is none')

      // 改变路径为项目目录下
      // if (this.promptes.isSyncGitlab) {
      destFilePath = `${this.promptes.projectName}/${destFilePath}`
      // }
      this.fs.copyTpl(
        this.templatePath(tplFilePath),
        this.destinationPath(`${this.options.contextRoot}/${destFilePath}`),
        this.promptes
      )
    })
  }
}

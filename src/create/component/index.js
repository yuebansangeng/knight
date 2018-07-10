
const Generator = require('yeoman-generator')
const request = require('request')
const { spawnSync, exec } = require('child_process')

module.exports = class extends Generator {
  prompting () {
    // 获取用户名，用于给Gitlab项目添加权限
    let { stdout } = spawnSync('git', [ 'config', 'user.name' ])
    let username = `${stdout}`.replace(/^\s+|\s+$/, '')

    return this.prompt([
      {
        'type': 'input',
        'name': 'moduleName',
        'message': '组件名字 ( 请使用使用小写英文、数字、中划线 )：'
      }, {
        'type': 'confirm',
        'name': 'isSyncGitlab',
        'message': '是否在gitlab上创建该项目',
        'default': true
      }, {
        'type': 'input',
        'name': 'username',
        'message': 'gitlab用户名',
        'default': username
      }
    ]).then(promptes => {
      // 名称只允许英文、数字、中划线
      let { moduleName } = promptes
      if (!moduleName || !moduleName.match(/^[a-z\-\d]+?$/)) {
        throw new Error(`组件名称格式不正确：${moduleName}, 请使用使用小写英文、数字、中划线`)
      }
      this.promptes = promptes
      this.promptes.projectName = promptes.moduleName // !(/^ux-/.test(cmpName)) ? `ux-${cmpName}` : cmpName
    })
  }

  writing () {
    if (!this.promptes.isSyncGitlab) {
      this._copyTemplateFiles()
      this._installPkg()
      return
    }

    let { projectName, username } = this.promptes
    request(`http://cmp.beisen.io/users/create-project?project=${projectName}&username=${username}`, (err, resp, body) => {
      if (err) {
        throw new Error(`${'Error'.red} gitlab上已有该项目|项目创建失败`)
      }

      const { code, message, data = {} } = JSON.parse(body)

      // 如果接口中返回非200，异常，则提示错误
      if (code !== 200) throw new Error(message)

      exec(`git clone git@gitlab.beisencorp.com:${data.group}/${this.promptes.projectName}.git`, (error, stdout, stderr) => {
        if (error) {
          throw new Error(`clone error: ${error}`)
        }

        console.log(`${'Warning:'.green}${this.promptes.projectName}项目clone成功,先执行cd ${this.promptes.projectName}跳至该项目再运行`)

        this._copyTemplateFiles()
        this._installPkg()
      })
    })
  }

  /*
  * 封装copy（API），减少代码量
  * 28原则：百分之20%的代码解决80%的功能
  * 函数名前面添加下滑线，告知Yeoman不自定执行改函数
  */
  _copyTemplateFiles () {
    this._private_copies([
      [ 'gitignore', '.gitignore' ], // npm publish，会忽略 .gitignore 文件
      [ 'index.js', 'src/index.js' ],
      [ 'example.js', 'examples/default/index.js' ],
      [ 'npmignore', '.npmignore' ],
      [ 'package.json' ],
      [ 'README.md' ],
      [ '.bscpmrc.json' ]
    ])
  }

  _installPkg () {
    if (this.promptes.isSyncGitlab) {
      // 跳转至当前组件项目路径下
      process.chdir(`${this.promptes.projectName}`)
    }
    
    this.npmInstall([ 'react@15.6.2', 'react-dom@15.6.2' ])
    this.npmInstall(
      [
        '@beisen/storybook-lib@latest',
        '@beisen/gulp-lib@latest'
      ], {
        'save-dev': true
      }
    )
  }

  _private_copies (copyJobs = []) {
    copyJobs.forEach(([ tplFilePath, destFilePath, tplData = {} ]) => {
      if (!destFilePath) {
        destFilePath = tplFilePath
      }
      if (!tplFilePath) throw new Error('tplFilePath is none')
      if (!destFilePath) throw new Error('destFilePath is none')

      // 改变路径为项目目录下
      if (this.promptes.isSyncGitlab) {
        destFilePath = `${this.promptes.projectName}/${destFilePath}`
      }
      this.fs.copyTpl(
        this.templatePath(tplFilePath),
        this.destinationPath(`${this.options.contextRoot}/${destFilePath}`),
        this.promptes
      )
    })
  }
}
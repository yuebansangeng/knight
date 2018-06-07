
const Generator = require('yeoman-generator')
const request = require('request')

module.exports = class extends Generator {

  prompting () {
    return this.prompt([
      {
        'type': 'input',
        'name': 'moduleName',
        'message': '组件名字 ( 不允许大写字母，请使用中划线命名 )：'
      }
    ]).then(promptes => {
      this.promptes = promptes
      this.promptes.cmpName =
        this.promptes.moduleName
          .replace(/-(\w)/g, (all, letter) => letter.toUpperCase())
          .replace(/^\w/, (all, letter) => all.toUpperCase())
    })
  }

  writing () {
    this._private_copies([
      [ 'gitignore', '.gitignore' ], // npm publish，会忽略 .gitignore 文件
      [ 'index.js', 'src/index.js' ],
      [ 'example.js', 'examples/default/index.js' ],
      [ 'npmignore', '.npmignore' ],
      [ 'package.json' ],
      [ 'README.md' ],
      [ '.bscpmrc.json' ]
    ])

    // 输入storybook 配置
    if (this.options.printStorybookConfig) {
      this._private_copies([
        [ '.babelrc', '.storybook/.babelrc' ],
        [ '.storybook/addons.js' ],
        [ '.storybook/config.js' ],
        [ '.storybook/preview-head.html' ],
        [ '.storybook/manager-head.html' ],
        [ '.storybook/util.js' ],
        [ '.storybook/webpack.config.js' ]
      ])
    }
  }

  install () {
    this.npmInstall([ 'react@15.6.2', 'react-dom@15.6.2' ])
    this.npmInstall(
      [
        '@beisen/storybook-lib@latest'
      ], {
        'save-dev': true
      }
    )
  }

  /*
  * 封装copy（API），减少代码量
  * 28原则：百分之20%的代码解决80%的功能
  * 函数名前面添加下滑线，告知Yeoman不自定执行改函数
  */
  _private_copies (copyJobs = []) {
    copyJobs.forEach(([ tplFilePath, destFilePath, tplData = {} ]) => {
      if (!destFilePath) {
        destFilePath = tplFilePath
      }
      if (!tplFilePath) throw new Error('tplFilePath is none')
      if (!destFilePath) throw new Error('destFilePath is none')

      this.fs.copyTpl(
        this.templatePath(tplFilePath),
        this.destinationPath(`${this.options.contextRoot}/${destFilePath}`),
        this.promptes
      )
    })
  }
}

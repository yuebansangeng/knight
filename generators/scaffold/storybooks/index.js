
var Generator = require('yeoman-generator')

module.exports = class extends Generator {

  prompting () {
    return this.prompt([
      {
        type: 'input',
        name: 'cmpName',
        message: 'This is your component name on flying.'
      }, {
        type: 'list',
        name: 'cpmCategoty',
        choices: [ 'Element Component', 'Layout Component', 'Property Component' ],
        message: 'Pick you component category.',
        default: true
      }
    ]).then(promptes => {
      this.promptes = promptes
    })
  }

  writing () {
    this._private_copies([
      [ 'config.js', '.storybook/config.js' ],
      [ 'webpack.config.js', '.storybook/webpack.config.js' ],
      [ 'addons.js', '.storybook/addons.js' ],
      [ 'env.js', '.storybook/env.js' ],
      [ '.babelrc', '.storybook/.babelrc' ]
    ])

    if (this.promptes.cpmCategoty === 'Element Component') {
      this._private_copies([
        [ 'index.js', '.storybook/index.js' ]
      ])
    } else if (this.promptes.cpmCategoty === 'Layout Component') {
      this._private_copies([
        [ 'index-layout.js', '.storybook/index.js' ]
      ])
    } else {
      this._private_copies([
        [ 'index.js', '.storybook/index.js' ]
      ])
    }
  }

  install () {
    // 修改程序的执行路径到目标文件夹中
    process.chdir(`${this.options.contextRoot}`)
  	this.npmInstall(
      [
        '@storybook/cli', '@storybook/react', 'storybook-readme', '@storybook/react' // storybook
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
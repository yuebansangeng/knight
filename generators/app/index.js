
var Generator = require('yeoman-generator')

module.exports = class extends Generator {

  prompting () {
  	return this.prompt([
      {
        type: 'input',
        name: 'cmpName',
        message: 'This is your component name on flying.'
      }, {
        type: 'input',
        name: 'moduleName',
        message: 'This is your component moudle name which use on dependencies manage.'
      }, {
        type: 'list',
        name: 'type',
        choices: [ 'Normal Component', 'Shared Component' ],
        message: 'This is your component type.'
      }, {
        type: 'confirm',
        name: 'hasStorybook',
        message: 'Are you use storybook ?',
        default: true
      }
    ]).then(promptes => {
      this.promptes = promptes
    })
  }

  writing () {
  	this._private_copies([
      [ 'index.js', 'src/index.js' ],
      [ 'package.json' ],
      [ 'webpack.config.js' ],
      [ '.gitignore' ],
      [ '.babelrc' ]
    ])

    if (this.promptes.type === 'Shared Component') {
      this._private_copies([[ '.gitlab-ci.yml' ]])
    }

    if (this.promptes.hasStorybook === true) {
      this._private_copies([
        [ '.storybook/config.js' ],
        [ '.storybook/.babelrc' ],
        [ '.storybook/webpack.config.js' ]
      ])
    }
  }

  install () {
    // 修改程序的执行路径到目标文件夹中
    process.chdir(`${this.contextRoot}`)

  	this.npmInstall(
      [
        'babel-cli', 'babel-loader', 'babel-core','babel-preset-env', // babel

        'babel-plugin-transform-object-assign', 'babel-plugin-transform-runtime',
        'babel-plugin-add-module-exports', 'babel-plugin-transform-decorators-legacy',
        'babel-plugin-transform-react-display-name', 'babel-plugin-transform-react-jsx', // babel plugins

        'sass-loader', 'less-loader', 'postcss-loader', 'style-loader',
        'file-loader', 'html-loader', 'markdown-loader', 'url-loader', // webpack loader

        '@storybook/cli', '@storybook/react', // storybook

        'react', 'react-dom', // react
      ], {
        'save-dev': true
      }
    )

    if (this.promptes.hasStorybook === true) {
      this.npmInstall(
        [
          '@storybook/react'
        ], {
          'save-dev': true
        }
      )
    } // if
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
      this.fs.copyTpl(
        this.templatePath(tplFilePath),
        this.destinationPath(`${this.contextRoot}/${destFilePath}`),
        this.promptes
      )
    })
  }
}
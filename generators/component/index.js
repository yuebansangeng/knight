
var Generator = require('yeoman-generator')

module.exports = class extends Generator {

  configuring () {
    // 如果参数重配置 contextRoot，则使用传入的变量
    if (this.options.contextRoot) {
      this.contextRoot = this.options.contextRoot  
    }
  }

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
      [ '.babelrc' ],
      // npm publish，会忽略 .gitignore 文件
      [ 'gitignore', '.gitignore' ],
      [ 'index.js', 'src/index.js' ],
      [ 'package.json' ],
      [ 'webpack.config.js' ],
      [ 'README.md' ]
    ])

    if (this.promptes.type === 'Shared Component') {
      this._private_copies([[ '.gitlab-ci.yml' ]])
    }

    if (this.promptes.hasStorybook === true) {
      this._private_copies([
        [ '.storybook/index.js' ],
        [ '.storybook/config.js' ],
        [ '.storybook/webpack.config.js' ],
        [ '.storybook/addons.js' ],
        [ '.babelrc', '.storybook/.babelrc' ]
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

        '@storybook/cli', '@storybook/react', 'storybook-readme', // storybook

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
      if (!tplFilePath) throw new Error('tplFilePath is none')
      if (!destFilePath) throw new Error('destFilePath is none')

      this.fs.copyTpl(
        this.templatePath(tplFilePath),
        this.destinationPath(`${this.contextRoot}/${destFilePath}`),
        this.promptes
      )
    })
  }
}
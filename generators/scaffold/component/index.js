
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
        type: 'confirm',
        name: 'cpmCategoty',
        choices: [ 'Element Component', 'Layout Component', 'Property Component' ],
        message: 'Are you use storybook ?',
        default: true
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
      [ '.publish' ],
      [ 'gitignore', '.gitignore' ], // npm publish，会忽略 .gitignore 文件
      [ 'index.js', 'src/index.js' ],
      [ 'package.json' ],
      [ 'README.md' ]
    ])

    if (this.promptes.cpmCategoty === 'Element Component') {
      this._private_copies([
        [ 'index.js', 'src/index.js' ]
      ])
    } else if (this.promptes.cpmCategoty === 'Layout Component') {
      this._private_copies([
        [ 'index-layout.js', 'src/index.js' ]
      ])
    } else {
      this._private_copies([
        [ 'index.js', 'src/index.js' ]
      ])
    }

    if (this.promptes.hasStorybook === true) {
      this._private_copies([
        [ '.storybook/config.js' ],
        [ '.storybook/webpack.config.js' ],
        [ '.storybook/addons.js' ],
        [ '.babelrc', '.storybook/.babelrc' ]
      ])

      if (this.promptes.cpmCategoty === 'Element Component') {
        this._private_copies([
          [ '.storybook/index.js' ]
        ])
      } else if (this.promptes.cpmCategoty === 'Layout Component') {
        this._private_copies([
          [ '.storybook/index-layout.js', '.storybook/index.js' ]
        ])
      } else {
        this._private_copies([
          [ '.storybook/index.js' ]
        ])
      }
    }
  }

  install () {
    // 修改程序的执行路径到目标文件夹中
    process.chdir(`${this.options.contextRoot}`)

  	this.npmInstall(
      [
        'babel-cli', 'babel-loader', 'babel-core','babel-preset-env', // babel

        'babel-plugin-transform-object-assign', 'babel-plugin-transform-runtime',
        'babel-plugin-add-module-exports', 'babel-plugin-transform-decorators-legacy',
        'babel-plugin-transform-react-display-name', 'babel-plugin-transform-react-jsx', // babel plugins

        'sass-loader', 'less-loader', 'postcss-loader', 'style-loader',
        'file-loader', 'html-loader', 'markdown-loader', 'url-loader', 'node-sass', // webpack loader

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
        this.destinationPath(`${this.options.contextRoot}/${destFilePath}`),
        this.promptes
      )
    })
  }
}
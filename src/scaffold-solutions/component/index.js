
var Generator = require('yeoman-generator')

module.exports = class extends Generator {

  prompting () {
  	return this.prompt([
      {
        'type': 'input',
        'name': 'moduleName',
        'message': '组件名字 ( 不允许大写字母，中划线命名 )：'
      }
    ]).then(promptes => {
      this.promptes = promptes
      this.promptes.cmpName =
        this.promptes.moduleName
          .replace('@beisen-cmps/', '')
          .replace(/-(\w)/g, (all, letter) => letter.toUpperCase())
          .replace(/^\w/, (all, letter) => all.toUpperCase())
    })
  }

  writing () {
  	this._private_copies([
      [ '.babelrc' ],
      [ '.publish', '.build/.publish' ],
      [ 'gitignore', '.gitignore' ], // npm publish，会忽略 .gitignore 文件
      [ 'index.js', 'src/index.js' ],
      [ 'BaseComponent.js', 'src/BaseComponent.js' ],
      [ 'demo.js', 'demos/default/index.js' ],
      [ 'package.json' ],
      [ '.eslintrc.json' ],
      [ 'README.md' ],
      [ '.yo-rc.json' ],
      [ 'gulpfile.js' ],
      // [ '.npmrc' ]
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
    // 修改程序的执行路径到目标文件夹中
    process.chdir(`${this.options.contextRoot}`)

    this.npmInstall([ 'react', 'react-dom' ])

  	this.npmInstall(
      [
        'babel-cli', 'babel-loader', 'babel-core','babel-preset-env', // babel
        'babel-plugin-transform-object-assign', 'babel-plugin-transform-runtime',
        'babel-plugin-add-module-exports', 'babel-plugin-transform-decorators-legacy',
        'babel-plugin-transform-react-display-name', 'babel-plugin-transform-react-jsx',
        'babel-preset-es2015', 'babel-preset-react', 'babel-preset-stage-0', 'babel-plugin-transform-proto-to-assign', // babel plugins
        // 'sass-loader', 'less-loader', 'postcss-loader', 'style-loader',
        // 'file-loader', 'html-loader', 'markdown-loader', 'url-loader', 'node-sass', // webpack loader
        'os',
        // '@storybook/cli', '@storybook/react', 'storybook-readme', '@storybook/addon-knobs',
        '@beisen/storybook-lib', // storybook
        // 'ejs', '@storybook/react', 
        'eslint',
        'gulp', 'gulp-babel', 'gulp-cssbeautify', 'gulp-postcss', 'gulp-replace', 'gulp-sass', 'del',
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
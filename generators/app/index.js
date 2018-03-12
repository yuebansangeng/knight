
var Generator = require('yeoman-generator')

module.exports = class extends Generator {

  prompting () {
  	return this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'This is your component name on flying.'
      }, {
        type: 'list',
        name: 'type',
        choices: [ 'Normal Component', 'Shared Component' ],
        message: 'This is your component type.'
      }, {
        type: 'input',
        name: 'moduleName',
        message: 'This is your component moudle name which use on dependencies manage.'
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
      [ '.gitignore' ]
    ])
    if (this.promptes.type === 'Shared Component') {
      this._private_copies([[ '.gitlab-ci.yml' ]])
    }
  }

  install () {
    // 修改程序的执行路径到目标文件夹中
    process.chdir(`${this.contextRoot}`)

  	this.npmInstall([
        'babel-loader', 'babel-core', // babel
        'sass-loader', 'less-loader', // css
        'file-loader' // png gif ..files
      ],
      { 'save-dev': true }
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
      this.fs.copyTpl(
        this.templatePath(tplFilePath),
        this.destinationPath(`${this.contextRoot}/${destFilePath}`),
        this.promptes
      )
    })
  }
}
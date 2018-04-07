
var Generator = require('yeoman-generator')

var devDependencies = require('./dev-dependencies')
var dependencies = require('./dependencies')
var copies = require('./copies')


module.exports = class extends Generator {

  prompting () {
  	return this.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'This is your project name.'
      }, {
        type: 'input',
        name: 'moduleName',
        message: 'This is your npm package name.'
      }, {
        type: 'input',
        name: 'projectDescription',
        message: 'Description',
      }, {
        type: 'confirm',
        name: 'hasStorybook',
        message: 'Use storybook?',
        default: true
      }
    ]).then(promptes => {
      this.promptes = promptes
    })
  }

  writing () {
  	this._private_copies(copies(this.promptes))
  }

  install () {
    // 修改程序的执行路径到目标文件夹中
    process.chdir(`${this.options.contextRoot}`)
    this.npmInstall(dependencies(this.promptes))
  	this.npmInstall(devDependencies(this.promptes), {
      'save-dev': true
    })
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
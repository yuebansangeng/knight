
const Generator = require('yeoman-generator')
const devDependencies = require('./dev-dependencies')
const dependencies = require('./dependencies')
const copies = require('./copies')
const copyUtil = require('../base/copy-util')

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
    copyUtil.call(this, copies(this.promptes))
  }

  install () {
    // 修改程序的执行路径到目标文件夹中
    process.chdir(`${this.options.contextRoot}`)

    // 安装依赖项
    this.npmInstall(dependencies(this.promptes))
    this.npmInstall(devDependencies(this.promptes), {
      'save-dev': true
    })
  }
}

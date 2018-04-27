
const Generator = require('yeoman-generator')
const copies = require('./copies')
const copyUtil = require('../base/copy-util')

module.exports = class extends Generator {

  prompting () {
    return this.prompt([
      {
        type: 'input',
        name: 'moduleName',
        message: 'package.json文件中的name'
      }
    ]).then(promptes => {
      this.promptes = promptes
    })
  }

  writing () {
    copyUtil.call(this, copies(this.promptes), '.temp')
  }

  end () {
    // publish 功能在发布组件完毕后，会自动创建codesandbox的项目
    // 创建完毕之后，会传入一个上传命令，把项目提交到codesandbox服务器
    let { callback } = this.options
    callback && callback()
  }
}

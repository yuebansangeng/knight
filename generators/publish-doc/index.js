
var Generator = require('yeoman-generator')

module.exports = class extends Generator {

  initializing () {
    this.log('我是一个子任务')
  }
}

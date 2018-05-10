
var Generator = require('yeoman-generator')

var shelljs = require('shelljs')
var os = require('object-assign')
var colors = require('colors')
var jsonlint = require("jsonlint")
var fs = require('fs')

module.exports = class extends Generator {

  writing () {
    let pckcnt = fs.readFileSync(`${this.contextRoot}/package.json`, 'utf8')
    // 转换文本到 json 对象，同时验证格式是否正确，并会返回错误ERR
    let pckJson = jsonlint.parse(pckcnt)

    let { destProject, unlink } = this.options

    // 在当前项目中，把组件模块link到全局中
    // shelljs.exec(`npm ${unlink ? 'un': ''}link`)

    // 进入要联调使用该模块的项目中，link全局模块
    shelljs.exec(`cd ${destProject} && npm ${unlink ? 'un': ''}link ${pckJson.name}`)
  }
}

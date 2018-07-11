
const Generator = require('yeoman-generator')
const fs = require('fs')

module.exports = class extends Generator {

  // 统一添加前缀组件模块前缀
  writing () {
    let packInfo = require(`${this.contextRoot}/package.json`)
    let bscpmrc = require(`${this.contextRoot}/bscpmrc.json`)

    // 自动配置字段生成
    if (!bscpmrc.description) {
      bscpmrc.description = packInfo.description
    }
    if (!bscpmrc.name) {
      bscpmrc.name = packInfo.name
    }
    if (!bscpmrc.libversion) {
      let libversion = 15
      if (packInfo.dependencies.react.match(/16/g)) {
        libversion = 16  
      }
      bscpmrc.libversion = libversion
    }

    fs.writeFileSync(`${this.contextRoot}/bscpmrc.json`, JSON.stringify(bscpmrc, null, 2))
  }
}

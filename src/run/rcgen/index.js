
import Generator from 'yeoman-generator'
import fs from 'fs'

// 当组件中没有 bscpmrc 文件时，自动生成

export default class extends Generator {

  // 统一添加前缀组件模块前缀
  writing () {
    const bscpmrc = this.options.bscpmrc
    const packInfo = this.options.package

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

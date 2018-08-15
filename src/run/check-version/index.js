
import Generator from 'yeoman-generator'
import gen from './gen'
import fs from 'fs'

export default class extends Generator {

  // 统一添加前缀组件模块前缀
  writing () {
    const { version } = this.options.package

    // 如果 version 已经存在了，就 throw Error
  }
}

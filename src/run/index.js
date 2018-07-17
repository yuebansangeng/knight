
import Generator from 'yeoman-generator'
import fs from 'fs'

export default class extends Generator {

  constructor (args, opts) {
    super(args, opts)
    this.argument('category', { 'type': String, 'required': true })
  }

  composing () {
    this._private_resolve(`./${this.options.category}/index.js`)
  }

  _private_resolve (path) {

    // 大部分功能中都需要用到 bscomrc 和 package 中的配置文件
    // 在这里统一提出，减少代码量、维护成本
    let bscpmrc = {}
    const rcExists = fs.existsSync(`${this.contextRoot}/.bscpmrc.json`)
    if (rcExists) {
      bscpmrc = require(`${this.contextRoot}/.bscpmrc.json`)
    }

    // package 中的配置文件
    const packinfo = require(`${this.contextRoot}/package.json`)

    this.composeWith(
      require.resolve(path),
      Object.assign(
        {},
        this.options,
        {
          bscpmrc,
          // package 在nodejs环境中是关键词
          'package': packinfo,
          // composeWith 调用的模块中
          // 无法通过this.contextRoot 获取到当前工作目录
          'contextRoot': this.contextRoot,
        }
      )
    )
  }
}

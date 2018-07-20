
import Generator from 'yeoman-generator'
import fs from 'fs'
import Hjson from 'hjson'

export default class extends Generator {

  constructor (args, opts) {
    super(args, opts)
    this.argument('category', { 'type': String, 'required': true })
  }

  composing () {
    this._private_resolve(`./${this.options.category}/index.js`)
  }

  _private_resolve (path) {
    const { RC_FILENAME } = process.env

    // 大部分功能中都需要用到 bscomrc 和 package 中的配置文件
    // 在这里统一提出，减少代码量、维护成本
    let rc = {}
    const rcExists = fs.existsSync(`${this.contextRoot}/${RC_FILENAME}`)
    if (rcExists) {
      rc = Hjson.parse(fs.readFileSync(`${this.contextRoot}/${RC_FILENAME}`, 'utf-8'))
    }

    // package 中的配置文件
    const packinfo = require(`${this.contextRoot}/package.json`)

    this.composeWith(
      require.resolve(path),
      Object.assign(
        {},
        this.options,
        {
          rc,
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


var Generator = require('yeoman-generator')

module.exports = class extends Generator {

  constructor(args, opts) {
    super(args, opts)
    this.argument('category', { type: String, required: true })
  }

  composing () {
    if (this.options.category === 'build') {
      this._private_resolve('./build/index.js')
    }
    if (this.options.category === 'prefixing') {
      this._private_resolve('./prefixing/index.js')
    }
    if (this.options.category === 'check') {
      this._private_resolve('./check/index.js')
    }
    if (this.options.category === 'record') {
      this._private_resolve('./record/index.js')
    }
    if (this.options.category === 'upgrade') {
      this._private_resolve('./upgrade/index.js')
    }
  }

  _private_resolve (path) {
    this.composeWith(
      require.resolve(path),
      // composeWith 调用的模块中
      // 无法通过this.contextRoot 获取到当前工作目录
      Object.assign({
        contextRoot: this.contextRoot
      }, this.options)
    )
  }
}

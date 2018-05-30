
var Generator = require('yeoman-generator')

module.exports = class extends Generator {

  constructor(args, opts) {
    super(args, opts)
    this.argument('category', { type: String, required: true })
  }

  composing () {
    if (this.options.category === 'examples') {
      this._private_resolve('./examples/index.js')
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

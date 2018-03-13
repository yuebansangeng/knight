
var BaseSubGenerator = require('yeoman-generator')

module.exports = class extends Generator {

  constructor(args, opts) {
    super(args, opts)
    this.argument('category', { type: String, required: true })
  }

  composing () {
    if (this.options.category === 'Component') {
      this._private_resolve('./component/index.js')
    }
  }

  _private_resolve (path) {
    this.composeWith(
      require.resolve('./component/index.js'),
      // composeWith 调用的模块中
      // 无法通过this.contextRoot 获取到当前工作目录
      { contextRoot: this.contextRoot }
    )
  }
}

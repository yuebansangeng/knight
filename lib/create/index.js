'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _yeomanGenerator = require('yeoman-generator');

var _yeomanGenerator2 = _interopRequireDefault(_yeomanGenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = class extends _yeomanGenerator2.default {

  constructor(args, opts) {
    super(args, opts);
    this.argument('category', { 'type': String, 'required': true });
  }

  composing() {
    if (this.options.category == 'undefined') this._private_resolve('./component/index.js');else this._private_resolve(`./${this.options.category}/index.js`);
  }

  _private_resolve(path) {
    this.composeWith(require.resolve(path),
    // composeWith 调用的模块中
    // 无法通过this.contextRoot 获取到当前工作目录
    Object.assign({
      'contextRoot': this.contextRoot
    }, this.options));
  }
};
module.exports = exports['default'];
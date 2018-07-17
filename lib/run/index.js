'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _yeomanGenerator = require('yeoman-generator');

var _yeomanGenerator2 = _interopRequireDefault(_yeomanGenerator);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = class extends _yeomanGenerator2.default {

  constructor(args, opts) {
    super(args, opts);
    this.argument('category', { 'type': String, 'required': true });
  }

  composing() {
    this._private_resolve(`./${this.options.category}/index.js`);
  }

  _private_resolve(path) {

    // 大部分功能中都需要用到 bscomrc 和 package 中的配置文件
    // 在这里统一提出，减少代码量、维护成本
    let bscpmrc = {};
    const rcExists = _fs2.default.existsSync(`${this.contextRoot}/.bscpmrc.json`);
    if (rcExists) {
      bscpmrc = require(`${this.contextRoot}/.bscpmrc.json`);
    }

    // package 中的配置文件
    const packinfo = require(`${this.contextRoot}/package.json`);

    this.composeWith(require.resolve(path), Object.assign({}, this.options, {
      bscpmrc,
      // package 在nodejs环境中是关键词
      'package': packinfo,
      // composeWith 调用的模块中
      // 无法通过this.contextRoot 获取到当前工作目录
      'contextRoot': this.contextRoot
    }));
  }
};
module.exports = exports['default'];
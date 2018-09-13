'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _yeomanGenerator = require('yeoman-generator');

var _yeomanGenerator2 = _interopRequireDefault(_yeomanGenerator);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _hjson = require('hjson');

var _hjson2 = _interopRequireDefault(_hjson);

var _readRc = require('@beisen/read-rc');

var _readRc2 = _interopRequireDefault(_readRc);

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
    let rc = (0, _readRc2.default)();

    // package 中的配置文件
    const packinfo = _fs2.default.existsSync(`${this.contextRoot}/package.json`) ? require(`${this.contextRoot}/package.json`) : {};

    this.composeWith(require.resolve(path), Object.assign({}, this.options, {
      rc,
      // package 在nodejs环境中是关键词
      'package': packinfo,
      // composeWith 调用的模块中
      // 无法通过this.contextRoot 获取到当前工作目录
      'contextRoot': this.contextRoot
    }));
  }
};
module.exports = exports['default'];
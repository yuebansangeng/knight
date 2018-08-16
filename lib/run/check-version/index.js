'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _yeomanGenerator = require('yeoman-generator');

var _yeomanGenerator2 = _interopRequireDefault(_yeomanGenerator);

var _gen = require('./gen');

var _gen2 = _interopRequireDefault(_gen);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = class extends _yeomanGenerator2.default {

  // 统一添加前缀组件模块前缀
  writing() {
    const { version } = this.options.package;

    // 如果 version 已经存在了，就 throw Error
  }
};
module.exports = exports['default'];
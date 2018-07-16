'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _yeomanGenerator = require('yeoman-generator');

var _yeomanGenerator2 = _interopRequireDefault(_yeomanGenerator);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 当组件中没有 bscpmrc 文件时，自动生成

exports.default = class extends _yeomanGenerator2.default {

  // 统一添加前缀组件模块前缀
  writing() {
    const bscpmrc = this.options.bscpmrc;
    const packInfo = this.options.package;

    // 自动配置字段生成
    if (!bscpmrc.description) {
      bscpmrc.description = packInfo.description;
    }

    if (!bscpmrc.name) {
      bscpmrc.name = packInfo.name;
    }

    if (!bscpmrc.libversion) {
      let libversion = 15;
      if (packInfo.dependencies.react.match(/16/g)) {
        libversion = 16;
      }
      bscpmrc.libversion = libversion;
    }

    _fs2.default.writeFileSync(`${this.contextRoot}/bscpmrc.json`, JSON.stringify(bscpmrc, null, 2));
  }
};
module.exports = exports['default'];
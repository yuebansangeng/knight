'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _yeomanGenerator = require('yeoman-generator');

var _yeomanGenerator2 = _interopRequireDefault(_yeomanGenerator);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 当组件中没有 bscpmrc 文件时，自动生成，以及自动补全
// 主要在Jenkins构建时，使用

exports.default = class extends _yeomanGenerator2.default {

  // 统一添加前缀组件模块前缀
  writing() {
    const bscpmrc = this.options.bscpmrc;
    const packInfo = this.options.package;

    // 使用 commonJs 规范提取组件维护者信息
    const developers = (packInfo.maintainers || []).map(developer => developer.name);

    // 从 package 中提取的配置信息
    const extractInfo = {
      'name': packInfo.name,
      'description': packInfo.description,
      'developers': developers,
      'team': 'Unknown',
      'category': '',
      'device': ''
    };

    const rconf = Object.assign({}, extractInfo, bscpmrc);

    _fs2.default.writeFileSync(`${this.contextRoot}/bscpmrc.json`, JSON.stringify(rconf, null, 2));
  }
};
module.exports = exports['default'];
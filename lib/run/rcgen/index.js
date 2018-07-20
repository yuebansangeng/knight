'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _yeomanGenerator = require('yeoman-generator');

var _yeomanGenerator2 = _interopRequireDefault(_yeomanGenerator);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _genrc = require('../genrc');

var _genrc2 = _interopRequireDefault(_genrc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 当组件中没有 rc 文件时，自动生成，以及自动补全
// 主要在Jenkins构建时，使用

exports.default = class extends _yeomanGenerator2.default {

  // 统一添加前缀组件模块前缀
  writing() {
    const { RC_FILENAME } = process.env;
    const rc = this.options.rc;

    const rconf = Object.assign({}, (0, _genrc2.default)(), rc);
    const rtconf = JSON.stringify(rconf, null, 2);

    _fs2.default.writeFileSync(`${this.contextRoot}/${RC_FILENAME}`, rtconf);

    console.log('rc文件生成完毕:');
    console.log(rtconf);
  }
};
module.exports = exports['default'];
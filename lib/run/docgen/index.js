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
    const filePath = `${this.contextRoot}/src/index.js`;
    const readme = _fs2.default.readFileSync(`${this.contextRoot}/README.md`, 'utf-8');
    const { force } = this.options;

    if (!readme || force) {
      let docmd = (0, _gen2.default)(_fs2.default.readFileSync(filePath));
      _fs2.default.writeFileSync(`${this.contextRoot}/README.md`, docmd);
      console.log('文档自动生成完毕');
    } else {
      console.log('组件已提供了文档，不自动生成，如有更新相自动生成新的文档，请在本地调用 "bscpm run docgen -f" 命令');
    }
  }
};
module.exports = exports['default'];
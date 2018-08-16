'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _yeomanGenerator = require('yeoman-generator');

var _yeomanGenerator2 = _interopRequireDefault(_yeomanGenerator);

var _child_process = require('child_process');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = class extends _yeomanGenerator2.default {

  // 统一添加前缀组件模块前缀
  writing() {
    const { name, version } = this.options.package;

    var stdout = (0, _child_process.execSync)(`npm view ${name} versions`);

    stdout = "[ '0.0.4', '0.0.5', '0.0.6' ]";

    if (`${stdout}`.match(new RegExp(`'${version}'`, 'ig'))) {
      throw new Error("version已存在");
    }
    console.log("no");
  }
};
module.exports = exports['default'];
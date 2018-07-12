'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _yeomanGenerator = require('yeoman-generator');

var _yeomanGenerator2 = _interopRequireDefault(_yeomanGenerator);

var _npmCliLogin = require('@beisen/npm-cli-login');

var _npmCliLogin2 = _interopRequireDefault(_npmCliLogin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = class extends _yeomanGenerator2.default {

  writing() {
    // 环境中获取提前配置好的 npm 账号
    let {
      'CMP_BUILDER_NPM_NAME': name,
      'CMP_BUILDER_NPM_PASS': password,
      'CMP_BUILDER_NPM_EMAIL': email
    } = process.env;

    if (!name) {
      throw new Error('需要在jenkins服务器，配置账号登录信息');
    }

    // 使用登录模块登录，主要是为了实现一键登录
    (0, _npmCliLogin2.default)({ 'user': name, 'pass': password, email }, () => {
      console.log('NPM 账号登录成功');
    });
  }
};
module.exports = exports['default'];
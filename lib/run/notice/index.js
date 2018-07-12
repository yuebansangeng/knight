'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _yeomanGenerator = require('yeoman-generator');

var _yeomanGenerator2 = _interopRequireDefault(_yeomanGenerator);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = class extends _yeomanGenerator2.default {

  // 统一添加前缀组件模块前缀
  writing() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const { CMP_SERVER_HOST } = process.env;
      const { name } = require(`${_this.contextRoot}/.bscpmrc.json`);
      const { 'name': module, version } = require(`${_this.contextRoot}/package.json`);
      const { cinumber, to, status = 'success' } = _this.options;

      if (!to) {
        throw new Error('缺少邮箱地址，请传入参数：to');
      }

      console.log(`邮件通知发送中...`);

      let { code, message } = yield new _bluebird2.default(function (resolve, reject) {
        (0, _request2.default)(`${CMP_SERVER_HOST}/ci/build-after-notice?name=${name}&version=${version}&module=${module}&to=${to}&status=${status}&cinumber=${cinumber}`, function (err, res, body) {
          if (err) {
            console.log(err);
            reject(err);
          }
          resolve(JSON.parse(body));
        });
      });

      if (code !== 200) {
        throw new Error(message);
      }

      console.log(message);
    })();
  }
};
module.exports = exports['default'];
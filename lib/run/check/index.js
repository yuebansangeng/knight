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
      const { name, team, category } = require(`${_this.contextRoot}/.bscpmrc.json`);
      const { 'name': module } = require(`${_this.contextRoot}/package.json`);

      if (!name) {
        throw new Error('请在 .bscpmrc 文件中，配置 name 字段');
      }
      if (!name.match(/^[A-Za-z\-\d]+?$/)) {
        throw new Error('.bscpmrc 文件中，name 字段只能包含有是字母、数字、中划线');
      }
      if (!team) {
        throw new Error('请在 .bscpmrc 文件中，配置 team 字段（team 字段将会用来组件唯一性验证，以及搜索功能）');
      }
      if (!category) {
        console.log('组件未配置 category，将为组件自动匹配一个最相近类型');
      }

      const { code, message, data } = yield new _bluebird2.default(function (resolve, reject) {
        (0, _request2.default)(`${CMP_SERVER_HOST}/users/check-cmp?name=${name || ''}&team=${team || ''}&module=${module || ''}`, function (err, res, body) {
          if (err) {
            console.log(err);
            reject(err);
          }
          resolve(JSON.parse(body));
        });
      });

      if (code !== 200 || !data) {
        throw new Error(message);
      }

      console.log(message);
    })();
  }
};
module.exports = exports['default'];
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _yeomanGenerator = require('yeoman-generator');

var _yeomanGenerator2 = _interopRequireDefault(_yeomanGenerator);

var _child_process = require('child_process');

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// 应公司内部运维要求，静态资源统一机器发布
// 生成完静态资源文件后，上传到指定服务器后，需要调用该任务，发布资源文件到 stnew03

exports.default = class extends _yeomanGenerator2.default {

  writing() {
    return _asyncToGenerator(function* () {
      yield new _bluebird2.default(function (resolve, reject) {

        // 环境中获取提前配置好的 jenkins 账号
        let {
          'JENKINS_DEPLOYUSER': deployuser,
          'JENKINS_RSYNC_JOB': jenkinsRsyncJob
        } = process.env;

        let curl_cp = (0, _child_process.spawn)('curl', ['-X', 'POST', jenkinsRsyncJob, '--user', deployuser]);

        curl_cp.stdout.on('data', function (data) {
          return console.log(`${data}`);
        });
        curl_cp.stderr.on('data', function (data) {
          return console.log(`${data}`);
        });

        curl_cp.on('close', function (code) {
          resolve(code);
        });
      });
    })();
  }
};
module.exports = exports['default'];
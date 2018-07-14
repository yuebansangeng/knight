'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _yeomanGenerator = require('yeoman-generator');

var _yeomanGenerator2 = _interopRequireDefault(_yeomanGenerator);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _child_process = require('child_process');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// 与一部分功能耦合，需要依赖组件项目中安装了某些模块才可以使用
// storybook-lib
// @sotyrbook/react

exports.default = class extends _yeomanGenerator2.default {

  // 统一添加前缀组件模块前缀
  writing() {
    var _this = this;

    return _asyncToGenerator(function* () {
      let { name } = _this.options.bscpmrc;
      let { 'name': module, version } = _this.options.package;

      console.log(`${name}/${version} 编译中...`);

      // 生成 stories.js 配置文件
      yield new _bluebird2.default(function (resolve, reject) {
        // buildonly: 只生成配置文件
        let bo_cp = (0, _child_process.spawn)('node', [`${_this.contextRoot}/node_modules/@beisen/storybook-lib/bin/index.js`, '--buildonly']);

        bo_cp.stdout.on('data', function (data) {
          return console.log(`${data}`);
        });
        bo_cp.stderr.on('data', function (data) {
          return console.log(`${data}`);
        });

        bo_cp.on('close', function () {
          resolve(true);
        });
      });

      // 构建
      let { code, message } = yield new _bluebird2.default(function (resolve, reject) {
        let resmsg = [];
        let build_cp = (0, _child_process.spawn)('node', ['node_modules/@storybook/react/bin/build.js', '-c', `./node_modules/@beisen/storybook-lib/lib`, '-o', `./storybook-static/${name}/${version}`], {
          'cwd': _this.contextRoot
        });
        build_cp.stdout.on('data', function (data) {
          return resmsg.push(`${data}`);
        });
        build_cp.stderr.on('data', function (data) {
          return resmsg.push(`${data}`);
        });
        build_cp.on('close', function (code) {
          // 如果不join的方式输出log，会在输出信息换行时出现问题
          resolve({ code, 'message': resmsg.join('') });
        });
      });

      if (code !== 0) {
        throw new Error(message);
      } else {
        console.log(message);
      }
    })();
  }
};
module.exports = exports['default'];
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _yeomanGenerator = require('yeoman-generator');

var _yeomanGenerator2 = _interopRequireDefault(_yeomanGenerator);

var _child_process = require('child_process');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _ejs = require('ejs');

var _ejs2 = _interopRequireDefault(_ejs);

var _getDemos = require('./get-demos');

var _getDemos2 = _interopRequireDefault(_getDemos);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = class extends _yeomanGenerator2.default {
  writing() {
    var _this = this;

    return _asyncToGenerator(function* () {

      // 创建 .build 文件夹
      const buildFolderPath = _path2.default.join(_this.contextRoot, '.build');
      if (!_fs2.default.existsSync(buildFolderPath)) {
        _fs2.default.mkdirSync(buildFolderPath);
      }

      yield new Promise(function (resolve, reject) {
        _ejs2.default.renderFile(_path2.default.join(__dirname, 'stories.ejs'), {
          'examples': (0, _getDemos2.default)(_path2.default.join(_this.contextRoot, 'examples')),
          'cpath': _this.contextRoot
        }, {}, // ejs options
        function (err, storiesjs) {
          if (err) {
            console.log(err);
            return reject(err);
          }
          // 在组建项目中创建配置文件
          _fs2.default.writeFile(_path2.default.join(_this.contextRoot, '.build', '.stories.js'), storiesjs, function (err) {
            if (err) {
              console.log(err);
              return reject(false);
            }
            console.log('the stories file is saved!');
            resolve(true);
          });
        });
      });

      // 创建demos的名字的文件，提供给组件共享平台使用
      yield new Promise(function (resolve, reject) {
        let demosFileContent = (0, _getDemos2.default)(_path2.default.join(_this.contextRoot, 'examples')).map(function ({ name }) {
          return { 'name': name };
        });

        _fs2.default.writeFile(_path2.default.join(_this.contextRoot, '.build', '.examples.json'), JSON.stringify(demosFileContent), function (err) {
          if (err) throw err;
          console.log('the .demos file is saved!');
        });
      });

      // 生成 lib 目录，以及内部转义好的文件
      yield new Promise(function (resolve, reject) {
        let cp_n = (0, _child_process.spawn)('node', ['node_modules/gulp/bin/gulp.js', '--colors'], { 'cwd': _this.contextRoot });
        cp_n.stdout.on('data', function (data) {
          return process.stdout.write(`${data}`);
        });
        cp_n.stderr.on('data', function (err_data) {
          return process.stdout.write(`${err_data}`);
        });
        cp_n.on('close', function () {
          resolve(true);
        });
      });
    })();
  }
};
module.exports = exports['default'];
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _yeomanGenerator = require('yeoman-generator');

var _yeomanGenerator2 = _interopRequireDefault(_yeomanGenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = class extends _yeomanGenerator2.default {

  // 统一添加前缀组件模块前缀
  writing() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const { CMP_SERVER_HOST } = process.env;
      let { name } = _this.options.bscpmrc;
      let { 'name': module, version } = _this.options.package;

      function print(chilprocess) {
        chilprocess.stdout.on('data', data => console.log(`${data}`.green));
        chilprocess.stderr.on('data', data => console.log(`${data}`.yellow));
      }

      print(spawn('node', ['make-stories.js', cpath], { 'cwd': __dirname }));
      print(spawn('node', ['make-demos.js', cpath], { 'cwd': __dirname }));

      print(spawn('gulp', [], { 'cwd': cpath }));

      print(spawn('node', ['make-config.js', cpath], { 'cwd': __dirname }));

      spawn('storybook-chrome-screenshot', ['-p', '9001', '-c', `${_path2.default.join(__dirname, '..', 'src')}`, '-o', `${cpath}/.build/.screenshot`]);
    })();
  }
};
module.exports = exports['default'];
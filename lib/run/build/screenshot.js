'use strict';

var _child_process = require('child_process');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// cpath 组件调用命令传入的路径
let cpath = process.cwd();

function print(chilprocess) {
  chilprocess.stdout.on('data', data => console.log(`${data}`.green));
  chilprocess.stderr.on('data', data => console.log(`${data}`.yellow));
}

print((0, _child_process.spawn)('node', ['make-stories.js', cpath], { 'cwd': __dirname }));
print((0, _child_process.spawn)('node', ['make-demos.js', cpath], { 'cwd': __dirname }));

print((0, _child_process.spawn)('gulp', [], { 'cwd': cpath }));

print((0, _child_process.spawn)('node', ['make-config.js', cpath], { 'cwd': __dirname }));

(0, _child_process.spawn)('storybook-chrome-screenshot', ['-p', '9001', '-c', `${_path2.default.join(__dirname, '..', 'src')}`, '-o', `${cpath}/.build/.screenshot`]);
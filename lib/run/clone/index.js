'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _gitClone = require('../clone/git-clone');

var _gitClone2 = _interopRequireDefault(_gitClone);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _yeomanGenerator = require('yeoman-generator');

var _yeomanGenerator2 = _interopRequireDefault(_yeomanGenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = class extends _yeomanGenerator2.default {
    writing() {
        _fs2.default.readFile('./rc.json', { encoding: 'utf-8' }, function (err, data) {
            if (err) throw 'error:失败，请在根目录下添加rc.json文件';
            let rc = JSON.parse(data);
            // 执行clone项目
            (0, _gitClone2.default)(rc.registries, rc.dir);
        });
    }
};
module.exports = exports['default'];
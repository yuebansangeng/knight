'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _yeomanGenerator = require('yeoman-generator');

var _yeomanGenerator2 = _interopRequireDefault(_yeomanGenerator);

var _child_process = require('child_process');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = class extends _yeomanGenerator2.default {
  writing() {
    var _this = this;

    return _asyncToGenerator(function* () {
      (0, _child_process.spawnSync)('node', [`${_this.options.contextRoot}/node_modules/.bin/sbl`, 'publish']);
    })();
  }
};
module.exports = exports['default'];
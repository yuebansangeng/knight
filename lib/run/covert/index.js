'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fastGlob = require('fast-glob');

var _fastGlob2 = _interopRequireDefault(_fastGlob);

var _yeomanGenerator = require('yeoman-generator');

var _yeomanGenerator2 = _interopRequireDefault(_yeomanGenerator);

var _logger = require('../../../helpers/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = class extends _yeomanGenerator2.default {

  writing() {
    var _this = this;

    return _asyncToGenerator(function* () {
      let { contextRoot, rc } = _this.options;
      let { components = [], workspaces = components } = rc;

      _logger2.default.enableProgress();
      let tracker = null;

      let packages = _fastGlob2.default.sync(workspaces, { 'onlyDirectories': true });
      packages = packages.map(function (p) {
        return _path2.default.join(contextRoot, p);
      });

      tracker = _logger2.default.newItem('coverting', packages.length);

      // 获取工作区中的所有模板和对应版本
      let pcks = [];
      for (let i = 0; i < packages.length; i++) {
        let pckinfo = require(_path2.default.join(packages[i], 'package.json'));
        pcks.push({
          'name': pckinfo.name,
          'version': pckinfo.version,
          'path': packages[i]
        });
      }

      let pckinfo = require(_path2.default.join(contextRoot, 'package.json'));

      for (let i = 0; i < pcks.length; i++) {
        if (pckinfo.dependencies[pcks[i].name]) {
          pckinfo.dependencies[pcks[i].name] = `^${pcks[i].version}`;
        }
        if (pckinfo.devDependencies[pcks[i].name]) {
          pckinfo.devDependencies[pcks[i].name] = `^${pcks[i].version}`;
        }
      }

      _fs2.default.writeFileSync(_path2.default.join(contextRoot, 'package.json'), JSON.stringify(pckinfo, null, 2));

      _logger2.default.silly('coverting', '');
      tracker.completeWork(1);
      tracker.finish();
    })();
  }
};
module.exports = exports['default'];
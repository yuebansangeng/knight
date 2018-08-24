'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fastGlob = require('fast-glob');

var _fastGlob2 = _interopRequireDefault(_fastGlob);

var _yeomanGenerator = require('yeoman-generator');

var _yeomanGenerator2 = _interopRequireDefault(_yeomanGenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = class extends _yeomanGenerator2.default {

  writing() {
    var _this = this;

    return _asyncToGenerator(function* () {
      let { contextRoot, packages, target } = _this.options;

      // 获取所有的需要转换的组件
      yield (0, _fastGlob2.default)(packages, { 'onlyDirectories': true }).then(function (pcks) {
        return pcks.map(function (p) {
          return _path2.default.join(contextRoot, p);
        });
      }).then(function (pcks) {
        return pcks.map(function (pckpath) {
          let parts = pckpath.split('/');
          let cmpname = parts[parts.length - 1];
          _fsExtra2.default.copySync(pckpath, _path2.default.join(contextRoot, target, cmpname), { 'filter': _this._private_copyFilter.bind(_this) });
          return pckpath;
        });
      });
    })();
  }

  _private_copyFilter(path) {
    let { filters = [] } = this.options;

    if (path.match(/package\.json/g)) {
      let pckjson = require(path);
      delete pckjson.devDependencies['@beisen/gulp-lib'];
      delete pckjson.devDependencies['@beisen/storybook-lib'];
      _fsExtra2.default.writeFileSync(path, JSON.stringify(pckjson, null, 2));
    }

    if (path.match(/node_modules|\.gitignore|lib|package-lock\.json/g)) {
      return false;
    }

    for (let i = 0; i < filters.length; i++) {
      if (path.match(new RegExp(filters[i]), 'g') !== -1) {
        return false;
      }
    }

    return true;
  }
};
module.exports = exports['default'];
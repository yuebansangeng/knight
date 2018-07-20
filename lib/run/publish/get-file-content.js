'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  getContent(filepath, utf8 = true) {
    if (!_fs2.default.existsSync(filepath)) {
      return null;
    }
    return utf8 ? _fs2.default.readFileSync(filepath, 'utf8') : _fs2.default.readFileSync(filepath);
  }
};
module.exports = exports['default'];
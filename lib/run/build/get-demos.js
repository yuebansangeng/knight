'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = source => {
  return (0, _fs.readdirSync)(source).map(name => _path2.default.join(source, name)).filter(source => (0, _fs.lstatSync)(source).isDirectory()).map(name => {
    return {
      'name': name.split('\/')[name.split('\/').length - 1],
      'hasEditableProps': !!_fs2.default.existsSync(_path2.default.join(name, 'editable-props.js')),
      'hasDoc': !!_fs2.default.existsSync(_path2.default.join(name, 'doc.md'))
    };
  });
};

module.exports = exports['default'];
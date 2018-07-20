'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

require('colors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 检测是否有新的版本，建议升级
exports.default = () => {

  return new _bluebird2.default((resolve, reject) => {

    const { CMP_SERVER_HOST } = process.env;

    (0, _request2.default)(`${CMP_SERVER_HOST}/users/get-cli-last-version`, (err, resp, body) => {
      if (err) {
        console.log(`${'Error'.red} err`);
        return reject(false);
      }

      const { version } = JSON.parse(body);
      if (_package2.default.version !== version) {
        console.log(`已有新的版本${version}, 请及时更新`.magenta);
      }
      resolve(version);
    });
  });
};

module.exports = exports['default'];
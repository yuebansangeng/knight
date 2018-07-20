'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _yeomanGenerator = require('yeoman-generator');

var _yeomanGenerator2 = _interopRequireDefault(_yeomanGenerator);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _getFileContent = require('./get-file-content');

var _getExamples = require('@beisen/get-examples');

var _getExamples2 = _interopRequireDefault(_getExamples);

var _readRc = require('@beisen/read-rc');

var _readRc2 = _interopRequireDefault(_readRc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = class extends _yeomanGenerator2.default {

  writing() {
    const { contextRoot } = this.options;
    const { CMP_SERVER_HOST } = process.env;

    // 获取当前组件包信息
    const packinfo = this.options.package;
    // 获取组件目录中定义的示例
    const examples = (0, _getExamples2.default)(contextRoot);

    // 组装接口上传需要的文件
    let formData = {
      'name': packinfo.name,
      'version': packinfo.version,
      'rc': JSON.stringify((0, _readRc2.default)()),
      'package': (0, _getFileContent.getContent)(`${contextRoot}/package.json`),
      'examples': JSON.stringify(examples),
      'readme': (0, _getFileContent.getContent)(`${contextRoot}/README.md`)

      // 提取组件示例的 js 和 css
    };examples.forEach(({ name }) => {
      formData[`example_code_${name}`] = (0, _getFileContent.getContent)(`${contextRoot}/examples/${name}/index.js`);
      formData[`example_css_${name}`] = (0, _getFileContent.getContent)(`${contextRoot}/examples/${name}/index.css`);
    });

    // 开始发布组件到共享中心
    console.log(`${'Starting'.yellow} publishing`);

    _request2.default.post({
      'url': `${CMP_SERVER_HOST}/users/publish`,
      'form': formData
    }, (err, resp, body) => {
      if (err || !/^2/.test(resp.statusCode)) {
        console.log(`${'Error'.red} publishing`);
        console.log(body);
        throw new Error(err);
      }

      // 处理结果返回值
      let { code, message, data } = JSON.parse(body);

      if (code === 200) {
        console.log(`${'Finished'.green} publishing`);
      } else {
        console.log(`${'Error'.red} publishing`);
        throw new Error(message);
      }
    });
  }
};
module.exports = exports['default'];
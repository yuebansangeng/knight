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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = class extends _yeomanGenerator2.default {

  writing() {
    const { contextRoot } = this.options;
    const { CMP_SERVER_HOST } = process.env;

    console.log(`bscpm ${'Starting'.yellow} package compress`);

    // 获取当前组件包信息
    let packinfo = this.options.package;
    // let examples = require(`${contextRoot}/.build/.examples.json`)

    // 获取组件目录中定义的示例
    const epath = _path2.default.join(contextRoot, 'examples');
    const examples = (0, _fs.readdirSync)(epath).map(name => _path2.default.join(epath, name)).filter(source => (0, _fs.lstatSync)(epath).isDirectory()).map(name => {
      return { 'name': name.split('\/')[name.split('\/').length - 1] };
    });

    // 组装接口上传需要的文件
    let formData = {
      'name': packinfo.name,
      'version': packinfo.version,
      'rc': (0, _getFileContent.getContent)(`${contextRoot}/.bscpmrc.json`),
      'package': (0, _getFileContent.getContent)(`${contextRoot}/package.json`),
      'examples': JSON.stringify(examples), // getContent(`${contextRoot}/.build/.examples.json`),
      'readme': (0, _getFileContent.getContent)(`${contextRoot}/README.md`)

      // 提取组件示例的 js 和 css
    };examples.forEach(({ name }) => {
      formData[`example_code_${name}`] = (0, _getFileContent.getContent)(`${contextRoot}/examples/${name}/index.js`);
      formData[`example_css_${name}`] = (0, _getFileContent.getContent)(`${contextRoot}/examples/${name}/index.css`);
    });

    // 开始发布组件到共享中心
    console.log(`bscpm ${'Starting'.yellow} publishing`);

    _request2.default.post({
      'url': `${CMP_SERVER_HOST}/users/publish`,
      'form': formData
    }, (err, resp, body) => {
      if (err || !/^2/.test(resp.statusCode)) {
        console.log(`bscpm ${'Error'.red} publishing`);
        throw new Error(err);
      }

      // 处理结果返回值
      let { code, message, data } = JSON.parse(body);

      if (code === 200) {
        console.log(`bscpm ${'Finished'.green} publishing`);
      } else {
        console.log(`bscpm ${'Error'.red} publishing`);
        throw new Error(message);
      }
    });
  }
};
module.exports = exports['default'];
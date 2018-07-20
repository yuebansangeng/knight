'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = () => {
  const cpath = process.cwd();
  const packInfo = require(`${cpath}/package.json`);
  const { maintainers = [], name, description } = packInfo;

  // 使用 commonJs 规范提取组件维护者信息
  const developers = maintainers.map(developer => developer.name);

  // 从 package 中提取的配置信息
  return {
    'name': name,
    'description': description,
    'developers': developers,
    'team': 'Unknown',
    'category': '',
    'device': ''
  };
};

module.exports = exports['default'];
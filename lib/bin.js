'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _yeomanEnvironment = require('yeoman-environment');

var _yeomanEnvironment2 = _interopRequireDefault(_yeomanEnvironment);

var _upgradeMsg = require('../lib/upgrade-msg');

var _upgradeMsg2 = _interopRequireDefault(_upgradeMsg);

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

_dotenv2.default.config({ 'path': _path2.default.join(__dirname, '..', '.env') });

const env = _yeomanEnvironment2.default.createEnv().register(require.resolve('../lib/create'), 'create').register(require.resolve('../lib/run'), 'run');

_commander2.default.version(_package2.default.version, '-v, --version');

_commander2.default.command('create').option('-u, --username [username]', 'Gitlab账号名，创建项目时添加最高权限的用户，默认是当前机器上的 git user.name').description('脚手架工具生成解决方案').action((() => {
  var _ref = _asyncToGenerator(function* (opts) {
    yield (0, _upgradeMsg2.default)();
    let { username } = opts;
    // 当前create命令还只支持组件项目，之后会逐步增加其他解决方案
    env.run('create component', { username });
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})());

_commander2.default.command('run <cmd>').option('-f, --force [force]', '强制生成文档 [docgen]').option('-c, --cinumber [cinumber]', 'Jenkins构建任务的编号 [record, build-after-notice]').option('-t, --to [to]', '邮件发送地址 [build-after-notice]').option('-s, --status [status]', 'Jenkins构建任务状态 [build-after-notice]').option('-j, --jobname [jobname]', 'Jenkins构建任务名 [record]').description('组件构建相关的命令：build, build-after-notice, build-storybook, check, docgen, login, publish, rcgen, record, rsync-statics').action((cmd, opts) => {
  // 不可以直接把opts传入run函数的第二个参数，会报错
  let { force, cinumber, jobname, to, status } = opts;
  env.run(`run ${cmd}`, { force, cinumber, jobname, to, status });
});

_commander2.default.parse(process.argv);
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _child_process = require('child_process');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const timeout = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Gitlab 刚创建的完毕的项目可能会出现找不到的情况
// 避免该情况，当出现找不到的异常时，重复获取5次尝试
const gitclone = (() => {
  var _ref = _asyncToGenerator(function* (num, group, project, messages) {
    if (num === -1) {
      console.log(messages.join(''));
      return false;
    }

    // 只缓存最后一次记录的msg
    messages = [];

    // close项目
    let code = yield new Promise(function (resolve, reject) {
      let cp_g = (0, _child_process.spawn)('git', ['clone', `git@gitlab.beisencorp.com:${group}/${project}.git`]);
      cp_g.stdout.on('data', function (m) {
        return messages.push(`${m}`);
      });
      cp_g.stderr.on('data', function (m) {
        return messages.push(`${m}`);
      });
      cp_g.on('close', function (code) {
        resolve(code);
      });
    });

    if (code !== 0) {
      if (messages.join('').match(/Could not read from remote repository/g)) {
        num--;
        yield timeout(500);
        gitclone(num, group, project, messages);
      } else {
        console.log(messages.join(''));
        return false;
      }
    } else {
      return true;
    }
  });

  return function gitclone(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
})();

exports.default = gitclone;
module.exports = exports['default'];
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _child_process = require('child_process');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const gitclone = (clone = [], path) => {
    if (path && !_fs2.default.existsSync(path)) {
        _fs2.default.mkdirSync(path);
    }
    process.chdir(path);
    const promises = clone.map(item => {
        return new Promise((resolve, reject) => {
            let cp_g = (0, _child_process.spawn)('git', ['clone', item.git]);
            cp_g.on('close', data => {
                //删除.git文件
                (0, _child_process.execSync)('rm -rf .git .gitignore', { cwd: item.git.split('/')[1].split('.')[0] });
                //给文件改名
                if (item.name) {
                    _fs2.default.rename(item.git.split('/')[1].split('.')[0], item.name, function (err) {
                        if (err) console.log('ERROR: ' + err);
                    });
                }
                return resolve(data);
            });
        });
    });
    Promise.all(promises).then(() => console.log('ok')).catch(() => {
        throw new Error();
    });
};
exports.default = gitclone;
module.exports = exports['default'];
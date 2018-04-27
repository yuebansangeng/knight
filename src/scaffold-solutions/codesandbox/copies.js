
module.exports = function (promptes = {}) {
  var copies = [
    [ 'gitignore', '.gitignore' ], // npm publish，会忽略 .gitignore 文件
    [ 'index.js', 'src/index.js' ],
    [ 'package.json' ],
    [ '.babelrc' ],
    [ 'README.md' ]
  ]
  return copies
}

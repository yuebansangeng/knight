
module.exports = function (promptes = {}) {

  var copies = [
    [ '.babelrc' ],
    [ 'gitignore', '.gitignore' ], // npm publish，会忽略 .gitignore 文件
    [ 'index.js', 'src/index.js' ],
    [ 'package.json' ],
    [ 'README.md' ]
  ]

  if (promptes.hasStorybook === true) {
    copies = copies.concat([
      [ '.storybook/config.js' ],
      [ '.storybook/webpack.config.js' ],
      [ '.storybook/addons.js' ],
      [ '.storybook/stories.js' ],
      [ '.babelrc', '.storybook/.babelrc' ]
    ])
  }

  return copies
}

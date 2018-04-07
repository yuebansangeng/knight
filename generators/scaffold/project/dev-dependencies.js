
module.exports = function (promptes = {}) {

  var devDeps = [
    'babel-cli', 'babel-loader', 'babel-core','babel-preset-env', // babel

    'babel-plugin-transform-object-assign', 'babel-plugin-transform-runtime',
    'babel-plugin-add-module-exports', 'babel-plugin-transform-decorators-legacy',
    'babel-plugin-transform-react-display-name', 'babel-plugin-transform-react-jsx', // babel plugins

    'sass-loader', 'less-loader', 'postcss-loader', 'style-loader',
    'file-loader', 'html-loader', 'markdown-loader', 'url-loader', 'node-sass', // webpack loader

    '@storybook/cli', '@storybook/react', 'storybook-readme', // storybook

    'react', 'react-dom', // react
  ]

  if (promptes.hasStorybook === true) {
    devDeps = devDeps.concat([
      '@storybook/react'
    ])
  }

  return devDeps
}

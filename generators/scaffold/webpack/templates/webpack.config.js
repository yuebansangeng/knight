
var webpack = require('webpack')
var ExtractTextPlugin = require("extract-text-webpack-plugin")
var path = require('path')
var root = path.join(__dirname, "../")
var loaders = require("./loaders")({})
var externals = require("./externals")

module.exports = (() => {

  return {
    entry: {
      main: './src/index.js'
    },
    output: {
      path: path.join(root, "./dist"),
      libraryTarget: 'umd',
      filename: "[name].bundle.js"
    },
    resolve: {
      alias: {
        "bowerRoot": path.join(root, './app/scripts/vendor'),
        "nodeRoot": path.join(root, './node_modules')
      },
      extensions: ['', '.js', '.jsx', '.css', '.json'],
      modulesDirectories: options.dir 
    },
    devtool: options.devtool,
    module: {
      loaders: loaders
    },
    node: {
      fs: "empty"
    },
    plugins: [
      new webpack.ProvidePlugin({
          "React": "react"
      }),
      new ExtractTextPlugin("css/[name].css",{
        disable: false,
        allChunks: true
      }),
      new webpack.DefinePlugin({
        __DEV__: JSON.stringify(JSON.parse(true || 'false'))
      }),
      new webpack.NoErrorsPlugin()
    ],
    externals: externals
  }
})()

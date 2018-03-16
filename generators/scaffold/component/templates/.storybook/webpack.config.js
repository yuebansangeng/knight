
var path = require("path")

module.exports = {
  module : {

    loaders : [
      {
        loader : 'babel-loader',
        test : /\.js|jsx$/,
        exclude : /node_modules/
      }, {
        test: /\.scss$/,
        loader: "style!css!sass"
      }, {
        test: /\.(jpe?g|png|gif)$/i,
        loader: 'file-loader'
      }, {
        test: /\.(ttf|eot|svg|woff(2)?)(\?[^('|")]*)?$/, 
        loader: "file-loader?name=images/[hash:8].[name].[ext]"
      }
    ],

    rules: [{
      test: /\.md$/,
      use: [{
        loader: 'html-loader'
      }, {
        loader: 'markdown-loader'
      }]
    }]
  }
}

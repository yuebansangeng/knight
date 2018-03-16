var ExtractTextPlugin = require("extract-text-webpack-plugin");
var path = require('path');

module.exports = function(options)  {
  return [
    {
      test: /\.js$/,
      loader: 'babel',
      exclude: path.join(options.root, 'node_modules')
    },
    {
      test: /\.css$/, loader: ExtractTextPlugin.extract(
      "style-loader",
      "css-loader?sourceMap",
      {
          publicPath: "../"
      }
    )},
    {
      test: /\.scss$/, loader: ExtractTextPlugin.extract(
      "style-loader",
      "css-loader?sourceMap!sass-loader",
      {
          publicPath: "../"
      }
    )}, 
    { 
      test: /\.json$/, loader: 'json-loader',
      exclude: path.join(options.root, 'node_modules')
    },
    {
      test: /\.(ttf|eot|svg|woff(2)?)(\?[^('|")]*)?$/, 
      loader: "file-loader?name=images/[name].[ext]"
    }, 
    {
      test: /\.(png|jpg|gif)$/,
      loader: "file-loader?name=images/[name].[ext]"
    },
    {
      test:  /containers(\/|\\)[^(\/|\\)]+(\/|\\)index\.js$/,
      loaders: ['bundle', 'babel'],
      include: path.join(options.root, './src','containers'),
      exclude: path.join(options.root, 'node_modules')
    }
  ]
}
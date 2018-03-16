
var webpack = require('webpack')
var ExtractTextPlugin = require("extract-text-webpack-plugin")
var path = require('path')
var root = path.join(__dirname, "../")

options = {
  "root": root
  ,"entry": {
    main: './src/index.js',
    // storybooks: './src/storybooks.js'
  }
  ,"debug": false
  ,"devtool": "cheap-source-map"
  ,"env": "prod"
}

module.exports = (function() {

  //路径
  var appRoot = path.join(options.root, './app');
  var bowerRoot = path.join(options.root, './app/scripts/vendor');
  var nodeRoot = path.join(options.root, './node_modules');

  var Filename = "[name]-[chunkhash].bundle.min.js";

  //加载器
  var loaders = require("./loaders")(options);
  var externals = require("./externals")

  var output = {
    path: path.join(options.root, "./dist"),
    libraryTarget: 'umd',
    filename: Filename,
    chunkFilename: "[name]-[chunkhash].chunk.min.js"
  }
 
  //别名
  var alias = {
      "bowerRoot": bowerRoot
      , "nodeRoot": nodeRoot
  };

  //压缩css
  var ExtractTextPluginConfig = new ExtractTextPlugin("css/[name]-[hash].min.css",{disable: false,allChunks: true});

  //插件
  var plugins = [
      new webpack.ProvidePlugin({
          "React": "react"
      })
      // ,
      // //定义特殊标签域的处理方式
      // new webpack.DefinePlugin({
      //     __DEV__: JSON.stringify(JSON.parse(true || 'false'))
      // })
      , ExtractTextPluginConfig
  ];

  plugins.push(
    new webpack.DefinePlugin({
        __DEV__: JSON.stringify(JSON.parse(true || 'false'))
    }),
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
        ,sourceMap: true
        ,mangle: {
            except: ['FormElement', 'NavItem']
        }
        ,minimize: true
    }),
    new webpack.NoErrorsPlugin()
  );

  // var WebapckComiplePlugin = require('@beisen/webpack-compile-plugin');
  // plugins.push(new WebapckComiplePlugin({ 'singler': options.singler }));

  return{
    //context: path.resolve(options.root, "app")
    //应用程序入口
    entry: options.entry
    //输出项配置
    ,output: output
    //其它解决方法配置
    ,resolve: {
        //查找module的话从这里开始查找
        //root: [appRoot, nodeRoot, bowerRoot] //设置绝对路径
        //模块别名定义，方便后续直接引用别名，无须多写长长的地址
        alias: alias
        //自动扩展文件后缀名，意味着我们require模块可以省略不写后缀名
        ,extensions: ['', '.js', '.jsx', '.css', '.json']
        ,modulesDirectories: options.dir 
    }
    //开发工具
    ,devtool: options.devtool
    //模块
    ,module: {
        //加载器
        loaders: loaders
    }
    ,node: {
      fs: "empty"
    }
    //插件项
    ,plugins: plugins
    //外部代码库
    ,externals: externals
    ,debug: options.debug
  }
})()

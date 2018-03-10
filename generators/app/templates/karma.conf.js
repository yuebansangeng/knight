var path = require('path');

module.exports = function(config) {
  config.set({
    basePath: '',
    browsers: [ 'Chrome' ],
    frameworks: ['jasmine'],
    files: [
      'tests/**/*.js'
    ],

    preprocessors: {
      // add webpack as preprocessor
      'src/**/*.js': ['webpack'],
      'tests/**/*.js': ['webpack']
    },

    webpack: { //kind of a copy of your webpack config
      module: {
        loaders: [
          {
            test: /\.js$/,
            loader: 'babel',
            exclude: path.resolve(__dirname, 'node_modules')
          },
          {
              test: /\.scss$/,
              loader: "style!css!sass",
              exclude : /node_modules/
          },
          {
              test: /\.json$/,
              loader: 'json',
          },
          {
              test: /\.(jpe?g|png|gif)$/i,
              loader: 'file-loader'
          },
          { 
              test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, 
              loader: "url?limit=30000&name=[name]-[hash].[ext]" 
          },
          {   
              test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, 
              loader: "url?limit=30000&name=[name]-[hash].[ext]" 
          },
          {   
              test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, 
              loader: "url?limit=30000&name=[name]-[hash].[ext]" 
          },
          { 
              test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, 
              loader: "url?limit=30000&name=[name]-[hash].[ext]" 
          },
          { 
              test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, 
              loader: "url?limit=10000&mimetype=image/svg+xml" 
          }
        ]
      },
      externals: {
        'react/lib/ExecutionEnvironment': true,
        'react/lib/ReactContext': true
      }
    },

    webpackServer: {
      noInfo: true //please don't spam the console when running in karma!
    },

    plugins: [
      'karma-webpack',
      'karma-jasmine',
      'karma-chrome-launcher'
    ],

    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
  })
};

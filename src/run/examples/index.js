
const Generator = require('yeoman-generator')
const { spawn, exec } = require('child_process')
const colors = require('colors')
const shelljs = require('shelljs')
const path = require('path')
const fs = require('fs')

function colorLog (data) {
  let printStr = `${data}`
  if (printStr.match(/Storybook started on/ig)) {
    printStr = `${printStr}`.green
  }
  process.stdout.write(printStr)
} 

function print (chilprocess) {
  chilprocess.stdout.on('data', data => colorLog(data))
  chilprocess.stderr.on('data', err_data => colorLog(err_data))
}

module.exports = class extends Generator {

  writing () {
    let { contextRoot } = this.options
    let stklibPath = 'node_modules/@beisen/storybook-lib'
    let stkCli = 'node_modules/@storybook/react/bin/index.js'

    print(spawn('node', [`${stklibPath}/bin/make-stories.js`, '--colors'], { 'cwd': contextRoot }))

    // 生成 lib 目录，以及内部转义好的文件
    print(spawn('node', [ 'node_modules/gulp/bin/gulp.js', '--colors'], { 'cwd': contextRoot }))

    // 判断组件内部是否配置storybooks配置
    // 配置了则不适用内部的 storybook-lib config
    let cpathStbkFlod = path.join('.storybook')
    let stbPreArgs = [ stkCli, '-s', '.', '-p', '9001', '-c' ]

    if (fs.existsSync(cpathStbkFlod)) {
      console.log(`已检测到在项目中出现.storybook文件夹，程序将不再使用默认storybook配置，请自行配置storybook.`.yellow)
      print(spawn('node', stbPreArgs.concat([ cpathStbkFlod ]), { 'cwd': contextRoot }))
    } else {
      // 生成 config 文件
      print(spawn('node', [`${stklibPath}/bin/make-config.js`, '--colors'], { 'cwd': contextRoot }))
      print(spawn('node', stbPreArgs.concat([ path.join(stklibPath, 'src') ]), { 'cwd': contextRoot }))
    }

    print(spawn('node', [ 'node_modules/gulp/bin/gulp.js', 'watch', '--colors'], { 'cwd': contextRoot }))
  }
}

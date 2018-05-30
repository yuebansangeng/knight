
const Generator = require('yeoman-generator')
const { spawn, exec } = require('child_process')

function print (chilprocess) {
  chilprocess.stdout.on('data', data => process.stdout.write(`${data}`))
  chilprocess.stderr.on('data', err_data => process.stdout.write(`${err_data}`))
}

module.exports = class extends Generator {

  writing () {
    let { contextRoot } = this.options
    let stklibPath = 'node_modules/@beisen/storybook-lib'

    print(spawn('node', [`${stklibPath}/bin/make-stories.js`, '--colors'], { 'cwd': contextRoot }))
    print(spawn('node', [`${stklibPath}/bin/make-demos.js`, '--colors'], { 'cwd': contextRoot }))

    // 生成 lib 目录，以及内部转义好的文件
    print(spawn('node', [ 'node_modules/gulp/bin/gulp.js', '--colors'], { 'cwd': contextRoot }))
  }
}

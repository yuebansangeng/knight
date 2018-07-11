
const Generator = require('yeoman-generator')
const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs')
const ejs = require('ejs')
const getDemos = require('./get-demos')

module.exports = class extends Generator {
  async writing () {

    // 创建 .build 文件夹
    const buildFolderPath = path.join(this.contextRoot, '.build')
    if (!fs.existsSync(buildFolderPath)) {
      fs.mkdirSync(buildFolderPath)
    }

    await new Promise((resolve, reject) => {
      ejs.renderFile(
        path.join(__dirname, 'stories.ejs'),
        {
          'examples': getDemos(path.join(this.contextRoot, 'examples')),
          'cpath': this.contextRoot
        },
        { }, // ejs options
        (err, storiesjs) => {
          if (err) {
            console.log(err)
            return reject(err)
          }
          // 在组建项目中创建配置文件
          fs.writeFile(path.join(this.contextRoot, '.build', '.stories.js'), storiesjs, (err) => {
            if (err) {
              console.log(err)
              return reject(false)
            }
            console.log('the stories file is saved!')
            resolve(true)
          })
        }
      )
    })

    // 创建demos的名字的文件，提供给组件共享平台使用
    await new Promise((resolve, reject) => {
      let demosFileContent =
        getDemos(path.join(this.contextRoot, 'examples'))
          .map(({ name }) => ({ 'name': name }))

      fs.writeFile(path.join(this.contextRoot, '.build', '.examples.json'), JSON.stringify(demosFileContent), (err) => {
        if (err) throw err
        console.log('the .demos file is saved!')
      })
    })

    // 生成 lib 目录，以及内部转义好的文件
    await new Promise((resolve, reject) => {
      let cp_n = spawn('node', [ 'node_modules/gulp/bin/gulp.js', '--colors'], { 'cwd': this.contextRoot })
      cp_n.stdout.on('data', data => process.stdout.write(`${data}`))
      cp_n.stderr.on('data', err_data => process.stdout.write(`${err_data}`))
      cp_n.on('close', () => {
        resolve(true)
      })
    })
  }
}

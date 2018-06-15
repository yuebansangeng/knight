
const Generator = require('yeoman-generator')
const Promise = require('bluebird')
const { spawn } = require('child_process')

module.exports = class extends Generator {

  // 统一添加前缀组件模块前缀
  async writing () {
    let { name } = require(`${this.contextRoot}/.bscpmrc.json`)
    let { 'name': module, version } = require(`${this.contextRoot}/package.json`)

    console.log(`${name}/${version} 编译中...`)

    await new Promise((resolve, reject) => {
      let resmsg = []

      let build_cp = spawn('node', [ 'node_modules/@storybook/react/bin/build.js', '-c', `${this.contextRoot}/node_modules/@beisen/storybook-lib/lib`, '-o', `./${name}/${version}` ])
      build_cp.stdout.on('data', data => resmsg.push(`${data}`))
      build_cp.stderr.on('data', data => resmsg.push(`${data}`))

      build_cp.on('close', () => {
        console.log(resmsg.join(''))
        resolve(true)
      })
    })
  }
}

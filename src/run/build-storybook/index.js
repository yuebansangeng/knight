
const Generator = require('yeoman-generator')
const Promise = require('bluebird')
const { spawn } = require('child_process')

module.exports = class extends Generator {

  // 统一添加前缀组件模块前缀
  async writing () {
    let { name } = require(`${this.contextRoot}/.bscpmrc.json`)
    let { 'name': module, version } = require(`${this.contextRoot}/package.json`)

    console.log(`${name}/${version} 编译中...`)

    // 生成 stories.js 配置文件
    await new Promise((resolve, reject) => {
      // buildonly: 只生成配置文件
      let bo_cp = spawn('node', [ `${this.contextRoot}/node_modules/@beisen/storybook-lib/bin/index.js`, '--buildonly' ])

      bo_cp.stdout.on('data', data => console.log(`${data}`))
      bo_cp.stderr.on('data', data => console.log(`${data}`))

      bo_cp.on('close', () => {
        resolve(true)
      })
    })

    // 构建
    await new Promise((resolve, reject) => {
      let resmsg = []

      let build_cp = spawn('node', [ 'node_modules/@storybook/react/bin/build.js', '-c', `${this.contextRoot}/node_modules/@beisen/storybook-lib/lib`, '-o', `./storybook-static/${name}/${version}` ])
      build_cp.stdout.on('data', data => resmsg.push(`${data}`))
      build_cp.stderr.on('data', data => resmsg.push(`${data}`))

      build_cp.on('close', () => {
        // 如果不join的方式输出log，会在输出信息换行时出现问题
        console.log(resmsg.join(''))
        resolve(true)
      })
    })
  }
}

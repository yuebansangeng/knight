
import Generator from 'yeoman-generator'
import Promise from 'bluebird'
import { spawn } from 'child_process'

// 与一部分功能耦合，需要依赖组件项目中安装了某些模块才可以使用
// storybook-lib
// @sotyrbook/react

export default class extends Generator {

  // 统一添加前缀组件模块前缀
  async writing () {
    let { name } = this.options.bscpmrc
    let { 'name': module, version } = this.options.package

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
    let { code, message } = await new Promise((resolve, reject) => {
      let resmsg = []
      let build_cp = spawn('node',
        [
          'node_modules/@storybook/react/bin/build.js',
          '-c', `./node_modules/@beisen/storybook-lib/lib`,
          '-o', `./storybook-static/${name}/${version}`
        ], {
          'cwd': this.contextRoot
        }
      )
      build_cp.stdout.on('data', data => resmsg.push(`${data}`))
      build_cp.stderr.on('data', data => resmsg.push(`${data}`))
      build_cp.on('close', code => {
        // 如果不join的方式输出log，会在输出信息换行时出现问题
        resolve({ code, 'message': resmsg.join('') })
      })
    })

    if (code !== 0 ) {
      throw new Error(message)
    } else {
      console.log(message)
    }
  }
}

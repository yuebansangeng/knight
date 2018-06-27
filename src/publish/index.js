
const Generator = require('yeoman-generator')
const { spawn, spawnSync, execSync } = require('child_process')
const fs = require('fs')
const request = require('request')
const colors = require('colors')
const { getContent } = require('./get-file-content')

module.exports = class extends Generator {

  writing () {

    console.log(`bscpm ${'Starting'.yellow} package compress`)

    // 获取当前组件包信息
    let packinfo = require(`${this.contextRoot}/package.json`)
    let examples = require(`${this.contextRoot}/.build/.examples.json`)

    // 组装接口上传需要的文件
    let formData = {
      'name': packinfo.name,
      'version': packinfo.version,
      'rc': getContent(`${this.contextRoot}/.bscpmrc.json`),
      'package': getContent(`${this.contextRoot}/package.json`),
      'examples': getContent(`${this.contextRoot}/.build/.examples.json`),
      'readme': getContent(`${this.contextRoot}/README.md`)
    }

    // 提取组件示例的 js 和 css
    examples.forEach(({ name }) => {
      formData[`example_code_${name}`] = getContent(`${this.contextRoot}/examples/${name}/index.js`)
      formData[`example_css_${name}`] = getContent(`${this.contextRoot}/examples/${name}/index.css`)
    })

    // 开始发布组件到共享中心
    console.log(`bscpm ${'Starting'.yellow} publishing`)

    request.post({
      'url': 'http://cmp.beisen.io/users/publish',
      'form': formData
    },
    (err, resp, body) => {
      if (err || !/^2/.test(resp.statusCode)) {
        console.log(`bscpm ${'Error'.red} publishing`)
        throw new Error(err)
      }

      // 处理结果返回值
      let { code, message, data } = JSON.parse(body)

      if (code === 200) {
        console.log(`bscpm ${'Finished'.green} publishing`)
      } else {
        console.log(`bscpm ${'Error'.red} publishing`)
        throw new Error(message)
      }
    })
  }
}

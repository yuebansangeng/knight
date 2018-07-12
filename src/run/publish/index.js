
import path from 'path'
import Generator from 'yeoman-generator'
import request from 'request'
import colors from 'colors'
import { getContent } from './get-file-content'

export default class extends Generator {

  writing () {
    const { contextRoot } = this.options
    const { CMP_SERVER_HOST } = process.env

    console.log(`bscpm ${'Starting'.yellow} package compress`)

    // 获取当前组件包信息
    let packinfo = require(`${contextRoot}/package.json`)
    let examples = require(`${contextRoot}/.build/.examples.json`)

    // 组装接口上传需要的文件
    let formData = {
      'name': packinfo.name,
      'version': packinfo.version,
      'rc': getContent(`${contextRoot}/.bscpmrc.json`),
      'package': getContent(`${contextRoot}/package.json`),
      'examples': getContent(`${contextRoot}/.build/.examples.json`),
      'readme': getContent(`${contextRoot}/README.md`)
    }

    // 提取组件示例的 js 和 css
    examples.forEach(({ name }) => {
      formData[`example_code_${name}`] = getContent(`${contextRoot}/examples/${name}/index.js`)
      formData[`example_css_${name}`] = getContent(`${contextRoot}/examples/${name}/index.css`)
    })

    // 开始发布组件到共享中心
    console.log(`bscpm ${'Starting'.yellow} publishing`)

    request.post({
      'url': `${CMP_SERVER_HOST}/users/publish`,
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

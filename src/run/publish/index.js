
import path from 'path'
import fs, { readdirSync, lstatSync } from 'fs'
import Generator from 'yeoman-generator'
import request from 'request'
import colors from 'colors'
import { getContent } from './get-file-content'
import getExamples from '@beisen/get-examples'

export default class extends Generator {

  writing () {
    const { contextRoot } = this.options
    const { CMP_SERVER_HOST, RC_FILENAME } = process.env

    // 获取当前组件包信息
    const packinfo = this.options.package
    // 获取组件目录中定义的示例
    const examples = getExamples(contextRoot)

    // 组装接口上传需要的文件
    let formData = {
      'name': packinfo.name,
      'version': packinfo.version,
      'rc': getContent(`${contextRoot}/${RC_FILENAME}`),
      'package': getContent(`${contextRoot}/package.json`),
      'examples': JSON.stringify(examples), // getContent(`${contextRoot}/.build/.examples.json`),
      'readme': getContent(`${contextRoot}/README.md`)
    }

    // 提取组件示例的 js 和 css
    examples.forEach(({ name }) => {
      formData[`example_code_${name}`] = getContent(`${contextRoot}/examples/${name}/index.js`)
      formData[`example_css_${name}`] = getContent(`${contextRoot}/examples/${name}/index.css`)
    })

    // 开始发布组件到共享中心
    console.log(`${'Starting'.yellow} publishing`)

    request.post({
      'url': `${CMP_SERVER_HOST}/users/publish`,
      'form': formData
    },
    (err, resp, body) => {
      if (err || !/^2/.test(resp.statusCode)) {
        console.log(`${'Error'.red} publishing`)
        console.log(body)
        throw new Error(err)
      }

      // 处理结果返回值
      let { code, message, data } = JSON.parse(body)

      if (code === 200) {
        console.log(`${'Finished'.green} publishing`)
      } else {
        console.log(`${'Error'.red} publishing`)
        throw new Error(message)
      }
    })
  }
}

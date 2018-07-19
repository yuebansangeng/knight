
import path from 'path'
import Generator from 'yeoman-generator'
import Promise from 'bluebird'
import request from 'request'

export default class extends Generator {

  // 统一添加前缀组件模块前缀
  async writing () {
    const { CMP_SERVER_HOST } = process.env
    const { name } = this.options.rc
    const { 'name': module, version } = this.options.package
    const { cinumber, to, status = 'success' } = this.options

    if (!to) {
      throw new Error('缺少邮箱地址，请传入参数：to')
    }

    console.log(`邮件通知发送中...`)

    let { code, message } = await new Promise((resolve, reject) => {
      request(`${CMP_SERVER_HOST}/ci/build-after-notice?name=${name}&version=${version}&module=${module}&to=${to}&status=${status}&cinumber=${cinumber}`, (err, res, body) => {
        if (err) {
          console.log(err)
          reject(err)
        }
        resolve(JSON.parse(body))
      })
    })

    if (code !== 200) {
      throw new Error(message)
    }

    console.log(message)
  }
}


const path = require('path')
const Generator = require('yeoman-generator')
const Promise = require('bluebird')
const request = require('request')
require('dotenv').config({ 'path': path.join(__dirname, '..', '..', '.env') })

module.exports = class extends Generator {

  // 统一添加前缀组件模块前缀
  async writing () {
    const { CMP_SERVER_HOST } = process.env
    const { name } = require(`${this.contextRoot}/.bscpmrc.json`)
    const { 'name': module, version } = require(`${this.contextRoot}/package.json`)

    console.log(`邮件通知发送中...`)

    let { code, message } = await new Promise((resolve, reject) => {
      // 组件发布状态，默认为成功
      let { cinumber, to, status = 'success' } = this.options
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


const path = require('path')
const Generator = require('yeoman-generator')
const Promise = require('bluebird')
const request = require('request')
require('dotenv').config({ 'path': path.join(__dirname, '..', '..', '.env') })


module.exports = class extends Generator {

  // 统一添加前缀组件模块前缀
  async writing () {
    const { CMP_SERVER_HOST } = process.env
    let { name } = require(`${this.contextRoot}/.bscpmrc.json`)
    let { 'name': module, version } = require(`${this.contextRoot}/package.json`)
    let { cinumber = '', jobname = 'build' } = this.options

    if (!name || !name.match(/^[A-Za-z\-\d]+?$/)) {
      name = 'unknown'
      console.log('组件 .bscpm 文件中的 name 属性格式不正确，只允许是字母、数字、中划线')
    }

    let { code, message } = await new Promise((resolve, reject) => {
      request(`${CMP_SERVER_HOST}/users/upgrade-cmp-build?name=${name}&version=${version}&module=${module}&cinumber=${cinumber}&jobname=${jobname}`, (err, res, body) => {
        if (err) {
          console.log(err)
          return reject(err)
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

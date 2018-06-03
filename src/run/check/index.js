
const Generator = require('yeoman-generator')
const Promise = require('bluebird')
const request = require('request')

module.exports = class extends Generator {

  // 统一添加前缀组件模块前缀
  async writing () {
    let { name, id } = require(`${this.contextRoot}/.bscpmrc.json`)
    let { 'name': module } = require(`${this.contextRoot}/package.json`)

    let { code, message, data } = await new Promise((resolve, reject) => {
      request(`http://cmp.beisen.io/users/check-cmp?name=${name||''}&id=${id||''}&module=${module||''}`, (err, res, body) => {
        if (err) {
          reject(err)
        }
        resolve(JSON.parse(body))
      })
    })

    if (code !== 200 || !data) {
      throw new Error(message)
    }

    console.log(message)
  }
}


const Generator = require('yeoman-generator')
const Promise = require('bluebird')
const request = require('request')

module.exports = class extends Generator {

  // 统一添加前缀组件模块前缀
  async writing () {
    let { name } = require(`${this.contextRoot}/.bscpmrc.json`)
    let { 'name': module, version } = require(`${this.contextRoot}/package.json`)
    let { buildNumber, jobName = 'build' } = this.options

    let { code, message, data } = await new Promise((resolve, reject) => {
      request(`http://dev.cmp.beisen.io/users/upgrade-cmp-build?name=${name}&version=${version}&module=${module}&cinumber=${buildNumber}&jobname=${jobName}`, (err, res, body) => {
        if (err) {
          console.log(err)
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

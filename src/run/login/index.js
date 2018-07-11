
const path = require('path')
const Generator = require('yeoman-generator')
const npmCliLogin = require('@beisen/npm-cli-login')
require('dotenv').config({ 'path': path.join(__dirname, '..', '..', '.env') })

module.exports = class extends Generator {

  writing () {
    // 环境中获取提前配置好的 npm 账号
    let {
      'CMP_BUILDER_NPM_NAME': name,
      'CMP_BUILDER_NPM_PASS': password,
      'CMP_BUILDER_NPM_EMAIL': email
    } = process.env

    if (!name) {
      throw new Error('需要在jenkins服务器，配置账号登录信息')
    }

    // 使用登录模块登录，主要是为了实现一键登录
    npmCliLogin({ 'user': name, 'pass': password, email }, () => {
      console.log('NPM 账号登录成功')
    })
  }
}

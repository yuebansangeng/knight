
const Generator = require('yeoman-generator')
const color = require('color')
const request = require('request')

module.exports = class extends Generator {

  // 统一添加前缀组件模块前缀
  writing () {
    let { name, id } = require(`${this.contextRoot}/.bscpmrc.json`)

    request(`http://cmp.beisen.io/users/check-cmp?name=${name||''}&id=${id||''}`, (err, res, body) => {
      if (err) throw new err

      let { code, data } = JSON.parse(body)
      if (!data) {
        throw new Error('组件已存在，组件名重复')
      }

    })
  }
}

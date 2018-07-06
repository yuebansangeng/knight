
const Generator = require('yeoman-generator')
const Promise = require('bluebird')
const request = require('request')

module.exports = class extends Generator {

  // 统一添加前缀组件模块前缀
  async writing () {
    let { name, team, category } = require(`${this.contextRoot}/.bscpmrc.json`)
    let { 'name': module } = require(`${this.contextRoot}/package.json`)

    if (!name) {
      throw new Error('请在 .bscpmrc 文件中，配置 name 字段')
    }
    if (!name.match(/^[A-Za-z\-\d]+?$/)) {
      throw new Error('.bscpmrc 文件中，name 字段只能包含有是字母、数字、中划线')
    }
    if (!team) {
      throw new Error('请在 .bscpmrc 文件中，配置 team 字段（team 字段将会用来组件唯一性验证，以及搜索功能）')
    }
    if (!category) {
      console.log('组件未配置 category，将为组件自动匹配一个最相近类型')
    }

    let { code, message, data } = await new Promise((resolve, reject) => {
      request(`http://cmp.beisen.io/users/check-cmp?name=${name||''}&team=${team||''}&module=${module||''}`, (err, res, body) => {
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

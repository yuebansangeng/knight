
import path from 'path'
import Generator from 'yeoman-generator'
import Promise from 'bluebird'
import request from 'request'

export default class extends Generator {

  // 统一添加前缀组件模块前缀
  async writing () {
    const { CMP_SERVER_HOST } = process.env
    let { name } = this.options.bscpmrc
    let { 'name': module, version } = this.options.package
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

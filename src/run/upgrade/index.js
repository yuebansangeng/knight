
const Generator = require('yeoman-generator')
const { spawn, exec } = require('child_process')
const fs = require('fs')
const path = require('path')

module.exports = class extends Generator {

  // 统一添加前缀组件模块前缀
  writing () {
    let { contextRoot, version } = this.options

    if (!version) {
      throw new Error('需要传入新的版本号：version')
    }

    let pckJson = require(`${contextRoot}/package.json`)
    // 所有的模块都添加统一前缀
    pckJson.version = version

    // 保存 package.json
    let pckcontent = JSON.stringify(pckJson, null, 2)

    fs.writeFile(path.join(contextRoot, 'package.json'), pckcontent, (err) => {
      console.log('The package.json version upgraded.')
      console.log(`The package.json new version is ${version}.`)
    })
  }
}

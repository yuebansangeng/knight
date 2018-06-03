
const Generator = require('yeoman-generator')
const { spawn, exec } = require('child_process')
const fs = require('fs')
const path = require('path')

module.exports = class extends Generator {

  // 统一添加前缀组件模块前缀
  writing () {
    let { contextRoot, prefix = '@beisen-cmps' } = this.options

    let pckJson = require(`${contextRoot}/package.json`)
    pckJson.version = this.options.version

    // 保存 package.json
    let pckcontent = JSON.stringify(pckJson, null, 2)

    fs.writeFile(path.join(contextRoot, 'package.json'), pckcontent, (err) => {
      console.log('The package.json version updated.')
      console.log(`The package.json new version is ${pckJson.version}.`)
    })
  }
}

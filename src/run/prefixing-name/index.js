
const Generator = require('yeoman-generator')
const { spawn, exec } = require('child_process')
const fs = require('fs')
const path = require('path')

module.exports = class extends Generator {

  // 统一添加前缀组件模块前缀
  writing () {
    let { contextRoot } = this.options

    let pckJson = require(`${contextRoot}/package.json`)
    let prefixname = '@beisen-cmps'
    
    // 去除添加的前缀
    let clearname = pckJson.name.replace(new RegExp(`^(${prefixname}/)+`), '')

    // 所有的模块都添加统一前缀
    pckJson.name = `${prefixname}/${clearname}`

    // 保存 package.json
    let pckcontent = JSON.stringify(pckJson, null, 2)

    fs.writeFile(path.join(contextRoot, 'package.json'), pckcontent, (err) => {
      console.log('The package.json name changed.')
      console.log(`The package.json new name is ${pckJson.name}.`)
    })
  }
}

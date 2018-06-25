
const Generator = require('yeoman-generator')
const gen = require('./gen')
const fs = require('fs')

module.exports = class extends Generator {

  // 统一添加前缀组件模块前缀
  writing () {
    let filePath = `${this.options.contextRoot}/src/index.js`

    let readme = fs.readFileSync(`${this.options.contextRoot}/README.md`)

    if (!`${readme}` || this.options.force) {
      let docmd = gen(fs.readFileSync(filePath))
      fs.writeFileSync(`${this.options.contextRoot}/README.md`, docmd)
      console.log('文档自动生成完毕')
    } else {
      console.log('组件已提供了文档，不自动生成，如有更新相自动生成新的文档，请在本地调用 "bscpm run docgen -f" 命令')
    }
  }
}


import Generator from 'yeoman-generator'
import fs from 'fs'
import genrc from '../genrc'

// 当组件中没有 rc 文件时，自动生成，以及自动补全
// 主要在Jenkins构建时，使用

export default class extends Generator {

  // 统一添加前缀组件模块前缀
  writing () {
    const { RC_FILENAME } = process.env
    const rc = this.options.rc
    
    const rconf = Object.assign({}, genrc(), rc)
    const rtconf = JSON.stringify(rconf, null, 2)

    fs.writeFileSync(`${this.contextRoot}/${RC_FILENAME}`, rtconf)

    console.log('rc文件生成完毕:')
    console.log(rtconf)
  }
}

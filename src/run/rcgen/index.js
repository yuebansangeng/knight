
import Generator from 'yeoman-generator'
import fs from 'fs'

// 当组件中没有 rc 文件时，自动生成，以及自动补全
// 主要在Jenkins构建时，使用

export default class extends Generator {

  // 统一添加前缀组件模块前缀
  writing () {
    const { RC_FILENAME } = process.env
    const rc = this.options.rc
    const packInfo = this.options.package

    // 使用 commonJs 规范提取组件维护者信息
    const developers = (packInfo.maintainers || []).map(developer => developer.name)

    // 从 package 中提取的配置信息
    const extractInfo = {
      'name': packInfo.name,
      'description': packInfo.description,
      'developers': developers,
      'team': 'Unknown',
      'category': '',
      'device': ''
    }

    const rconf = Object.assign({}, extractInfo, rc)
    const rtconf = JSON.stringify(rconf, null, 2)

    fs.writeFileSync(`${this.contextRoot}/${RC_FILENAME}`, rtconf)

    console.log('rc文件生成完毕:')
    console.log(rtconf)
  }
}

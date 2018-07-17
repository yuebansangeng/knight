
import Generator from 'yeoman-generator'
import fs from 'fs'

// 当组件中没有 bscpmrc 文件时，自动生成，以及自动补全
// 主要在Jenkins构建时，使用

export default class extends Generator {

  // 统一添加前缀组件模块前缀
  writing () {
    const bscpmrc = this.options.bscpmrc
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

    const rconf = Object.assign({}, extractInfo, bscpmrc)

    fs.writeFileSync(`${this.contextRoot}/bscpmrc.json`, JSON.stringify(rconf, null, 2))
  }
}


import Generator from 'yeoman-generator'
import { execSync } from 'child_process'

export default class extends Generator {

  // 统一添加前缀组件模块前缀
  writing () {
    const { name, version } = this.options.package

    var stdout = execSync(`npm view ${name} versions`)
    
    if (`${stdout}`.match(new RegExp(`'${version}'`, 'ig'))) {
      throw new Error("version已存在")
    }
  }
}

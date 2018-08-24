
import fs from 'fs-extra'
import path from 'path'
import fg from 'fast-glob'
import Generator from 'yeoman-generator'

export default class extends Generator {

  async writing () {
    let { contextRoot, packages, target } = this.options

    // 获取所有的需要转换的组件
    await fg(packages, { 'onlyDirectories': true })
      .then(pcks => pcks.map(p => path.join(contextRoot, p)))
      .then(pcks => {
        return pcks.map(pckpath => {
          let parts = pckpath.split('/')
          let cmpname = parts[parts.length - 1]
          fs.copySync(pckpath, path.join(contextRoot, target, cmpname), { 'filter': this._private_copyFilter.bind(this) })
          return pckpath
        })
      })
  }

  _private_copyFilter (path) {
    let { filters = [] } = this.options

    if (path.match(/package\.json/g)) {
      let pckjson = require(path)
      delete pckjson.devDependencies['@beisen/gulp-lib']
      delete pckjson.devDependencies['@beisen/storybook-lib']
      fs.writeFileSync(path, JSON.stringify(pckjson, null, 2))
    }

    if (path.match(/node_modules|\.gitignore|lib|package-lock\.json/g)) {
      return false
    }

    for (let i = 0; i < filters.length; i++) {
      if (path.match(new RegExp(filters[i]), 'g') !== -1) {
        return false
      }
    }

    return true
  }
}


import fs from 'fs'
import path from 'path'
import fg from 'fast-glob'
import Generator from 'yeoman-generator'
import logger from '../../../helpers/logger'

export default class extends Generator {

  async writing () {
    let { contextRoot,rc } = this.options
    let { components = [], workspaces = components } = rc

    logger.enableProgress()
    let tracker = null

    let packages = fg.sync(workspaces, { 'onlyDirectories': true })
    packages = packages.map(p => path.join(contextRoot, p))
      
    tracker = logger.newItem('coverting', packages.length)

    // 获取工作区中的所有模板和对应版本
    let pcks = []
    for (let i = 0; i < packages.length; i++) {
      let pckinfo = require(path.join(packages[i], 'package.json'))
      pcks.push({
        'name': pckinfo.name,
        'version': pckinfo.version,
        'path': packages[i]
      })
    }

    let pckinfo = require(path.join(contextRoot, 'package.json'))

    for (let i = 0; i < pcks.length; i++) {
      if (pckinfo.dependencies[pcks[i].name]) {
        pckinfo.dependencies[pcks[i].name] = `^${pcks[i].version}`
      }
      if (pckinfo.devDependencies[pcks[i].name]) {
        pckinfo.devDependencies[pcks[i].name] = `^${pcks[i].version}`
      }
    }

    fs.writeFileSync(
      path.join(contextRoot, 'package.json'),
      JSON.stringify(pckinfo, null, 2)
    )

    logger.silly('coverting', '')
    tracker.completeWork(1)
    tracker.finish()
  }
}


import Generator from 'yeoman-generator'
import { spawnSync } from 'child_process'

export default class extends Generator {
  async writing () {
    spawnSync('node', [
      `${this.options.contextRoot}/node_modules/.bin/sbl`,
      'publish'
    ])
  }
}

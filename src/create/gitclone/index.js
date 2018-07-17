
import Generator from 'yeoman-generator'
import Promise from 'bluebird'

export default class extends Generator {

  writing () {
    let { messages = [], group, project } = this.options

    const gitclone = async _self (num = 5) => {
      if (num === -1) {
        return console.log(messages.join(''))
      }

      // 只缓存最后一次记录的msg
      messages = []

      // close项目
      let code = await new Promise((resolve, reject) => {
        let cp_g = spawnSync('git', [ 'clone', `git@gitlab.beisencorp.com:${group}/${projectName}.git` ])
        cp_g.stdout.on('data', m => messages.push(`${m}`))
        cp_g.stderr.on('data', m => messages.push(`${m}`))
        cp_g.on('close', code => {
          resolve(code)
        })
      })

      if (code !== 0) _self(num--)
    }

    gitclone(5)
  }
}

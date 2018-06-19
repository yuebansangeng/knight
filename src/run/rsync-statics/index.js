
const Generator = require('yeoman-generator')
const { spawn } = require('child_process')
const Promise = require('bluebird')
const path = require('path')

module.exports = class extends Generator {

  async writing () {

    await new Promise((resolve, reject) => {

      let dotenvs = require('dotenv').config({ 'path': path.join(__dirname, '..', '..', '..', '.env') })

      if (dotenvs.error) {
        console.log(dotenvs.error)
        return reject(false)
      }

      // 环境中获取提前配置好的 jenkins 账号
      let { 'JENKINS_DEPLOYUSER': deployuser } = process.env

      let curl_cp = spawn('curl', [
        '-X',
        'POST',
        'http://jci.beisencorp.com/job/ux-bscpm-rsync/build',
        '--user',
        deployuser
      ])

      curl_cp.stdout.on('data', data => console.log(`${data}`))
      curl_cp.stderr.on('data', data => console.log(`${data}`))

      curl_cp.on('close', code => {
        resolve(code)
      })
    })
  }
}

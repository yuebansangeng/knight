
const path = require('path')
const Promise = require('bluebird')
const request = require('request')
const pckJson = require('../package.json')
require('colors')
require('dotenv').config({ 'path': path.join(__dirname, '..', '.env') })


// 检测是否有新的版本，建议升级
module.exports = () => {
  return new Promise((resolve, reject) => {

    const { CMP_SERVER_HOST } = process.env

    request(`${CMP_SERVER_HOST}/users/get-bscpm-last-version`, (err, resp, body) => {
      if (err) {
        console.log(`${'Error'.red} err`)
        return reject(false)
      }

      const { version } = JSON.parse(body)
      if (pckJson.version !== version) {
        console.log(`@beisen/bscpm 已有新的版本${version}, 请及时更新`.magenta)
      }

      resolve(true)
    })
  })
}

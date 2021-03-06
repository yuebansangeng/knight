
import path from 'path'
import Promise from 'bluebird'
import request from 'request'
import pckJson from '../package.json'
import 'colors'

// 检测是否有新的版本，建议升级
export default () => {

  return new Promise((resolve, reject) => {

    const { CMP_SERVER_HOST } = process.env

    request(`${CMP_SERVER_HOST}/users/get-cli-last-version`, (err, resp, body) => {
      if (err) {
        console.log(`${'Error'.red} err`)
        return reject(false)
      }

      const { version } = JSON.parse(body)
      if (pckJson.version !== version) {
        console.log(`已有新的版本${version}, 请及时更新`.magenta)
      }
      resolve(version)
    })
  })
}

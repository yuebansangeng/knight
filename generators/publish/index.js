
var Generator = require('yeoman-generator')
var http = require('http')
var fs = require('fs')
var jsonfile = require('jsonfile')
var shelljs = require('shelljs')

module.exports = class extends Generator {

  writing () {
    if (!this.config.get('publish-path')) {
      console.log('请使用 `bscpm set publish-path:[url]` 配置组件发布的站点')
      return
    }

    jsonfile.readFile(
      `${this.contextRoot}/.publish`,
      (err, publishJson) => {
        jsonfile.readFile(
          `${this.contextRoot}/package.json`,
          (err, pckJson) => {

            // 发布组件到 npm 服务器
            shelljs.exec(`cd ${this.contextRoot} && npm publish`)
            var inter = setInterval(() => {
              var { stdout } = shelljs.exec(`npm show ${pckJson.name} version`)

              // 判断包已经发布到了 npm 服务器上
              if (stdout.replace(/\n/ig, '') === pckJson.version) {
                console.log('New pck version has be discovered.')
                clearInterval(inter)

                // 调用共享库站点的接口，发布组件
                http.get(`${this.config.get('publish-path')}?name=${publishJson.name}&module=${pckJson.name}&version=${pckJson.version}`, (res) => {

                  var { statusCode } = res
                  var contentType = res.headers['content-type']
                  var error
                  if (statusCode !== 200) {
                    error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`)
                  }
                  if (error) {
                    console.error(error.message);
                    res.resume()
                    return
                  }
                  res.setEncoding('utf8')
                  var rawData = ''
                  res.on('data', (chunk) => { rawData += chunk })
                  res.on('end', () => {
                    try {
                      console.log(rawData)
                    } catch (e) {
                      console.error(e.message)
                    }
                  })
                }).on('error', (e) => {
                  console.error(`Got error: ${e.message}`)
                })
              }
            }, 500)
          }
        )
      }
    )
  }
}

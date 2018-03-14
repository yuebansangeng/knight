
var Generator = require('yeoman-generator')
var http = require('http')
var fs = require('fs')
var jsonfile = require('jsonfile')

module.exports = class extends Generator {

  writing () {

    if (!this.config.get('publish-path')) {
      console.log('请使用 `bscpm set publish-path:[url]` 配置组件发布的站点')
    }

    jsonfile.readFile(
      `${this.contextRoot}/.publish`,
      (err, publishJson) => {
        jsonfile.readFile(
          `${this.contextRoot}/package.json`,
          (err, pckJson) => {

            // 调用共享库站点的接口，发布组件
            http.get(`${this.config.get('publish-path')}?name=${publishJson.name}&module=${pckJson.name}`, (res) => {
              var { statusCode } = res
              var contentType = res.headers['content-type']
              var error
              if (statusCode !== 200) {
                error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`)
              }
              if (error) {
                console.error(error.message);
                res.resume()
                reject(e)
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
                  reject(e)
                }
              })
            }).on('error', (e) => {
              console.error(`Got error: ${e.message}`)
              reject(e)
            })
          }
        )
      }
    )
  }
}

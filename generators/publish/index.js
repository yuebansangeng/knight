
var Generator = require('yeoman-generator')
var jsonfile = require('jsonfile')
var shelljs = require('shelljs')
var os = require('object-assign')
var request = require('request')

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

                request.post(
                  this.config.get('publish-path'),
                  {
                    form: {
                      metadata: JSON.stringify(os({
                        module: pckJson.name,
                        version: pckJson.version
                      }, publishJson))
                    }
                  },
                  (e, r, body) => {
                    console.log(body)
                  }
                )
              }
            }, 500)
          }
        )
      }
    )
  }
}


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

            // 生成 es5 代码
            shelljs.exec(`cd ${this.contextRoot} && npm run build:lib`)

            // 发布组件到 npm 服务器
            shelljs.exec(`cd ${this.contextRoot} && npm publish`)
            var inter = setInterval(() => {

              var { code, stdout } = shelljs.exec(`npm show ${pckJson.name} version`)
              if (code !== 0) {
                console.log(`\nShell Script Error: npm show ${pckJson.name} version`)
                clearInterval(inter)
                return
              }

              // 当前模块的最新版本号
              var currentPckVersion = stdout.replace(/\n/ig, '')

              // 判断包已经发布到了 npm 服务器上
              if (currentPckVersion === pckJson.version) {
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
                    if (e) {
                      console.log(e)
                    } else {
                      console.log(body)  
                    }
                  }
                )
              } else {
                console.log(`The new pck diff is different, please wait. [ ${currentPckVersion} diff ${pckJson.version} ]`)
                console.log(`If the version which in package.json is different with npm‘s online-version, you must sync it.`)
              }
            }, 500)
          }
        )
      }
    )
  }
}

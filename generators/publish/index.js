
var Generator = require('yeoman-generator')
var jsonfile = require('jsonfile')
var shelljs = require('shelljs')
var os = require('object-assign')
var request = require('request')
var npmLogin = require('npm-cli-login')
var colors = require('colors')
var jsonlint = require("jsonlint")
var fs = require('fs')

module.exports = class extends Generator {

  constructor (args, opts) {
    super(args, opts)
    this.isNpmLogined = false
  }

  configuring () {
    let name = this.config.get('npm-user-name')
    let password = this.config.get('npm-user-password')
    let email = this.config.get('npm-user-email')

    // 判断是否登陆了 npm
    let { code, stdout } = shelljs.exec(`npm whoami --color always`)

    // 未登录成功
    if (code !== 0) {
      if (!name || !password || !email) {
        console.log(`\nPlease set config for npm login [ username, password, email ].`.red)
        console.log(`bscpm set npm-user-name: [username]`)
        console.log(`bscpm set npm-user-password: [password]`)
        console.log(`bscpm set npm-user-email: [email]\n`)
        return
      } else {
        // 登陆 npm
        npmLogin(name, password, email)
      }
    } else {
      // npm 登陆的账号并不是所配置的，切换账号
      if (stdout !== name) {
        console.log(`The npm logined user is not configed user, longing again.`.yellow)
        shelljs.exec(`npm logout --color always`)
        npmLogin(name, password, email)
      }
    }

    console.log(`\nNpm user logined: ${name}`.green)

    this.isNpmLogined = true
  }

  writing () {
    if (!this.isNpmLogined) return

    if (!this.config.get('publish-path')) {
      console.log('Please use `bscpm set publish-path:[url]` set url which path will be publishing.'.red)
      return
    }

    let pubcnt = fs.readFileSync(`${this.contextRoot}/.publish`, 'utf8')
    let pckcnt = fs.readFileSync(`${this.contextRoot}/package.json`, 'utf8')

    // 转换文本到 json 对象，同时验证格式是否正确，并会返回错误ERR
    let publishJson = jsonlint.parse(pubcnt)
    let pckJson = jsonlint.parse(pckcnt)

    // 生成 es5 代码
    shelljs.exec(`cd ${this.contextRoot} && npm run build:lib --color always`)

    // 发布组件到 npm 服务器
    let { code } = shelljs.exec(`cd ${this.contextRoot} && npm publish --color always`)

    // 持续抓包，检测新的包已经发布到了 npm 上
    var inter = setInterval(() => {

      var { code, stdout } = shelljs.exec(`npm show ${pckJson.name} version --color always`)
      
      if (code !== 0) {
        console.log(`\nbscpm ${'ERR!'} Shell Script Error: npm show ${pckJson.name} version`)
        clearInterval(inter)
        return
      }

      // 当前模块的最新版本号
      var currentPckVersion = stdout.replace(/\n/ig, '')

      // 判断包已经发布到了 npm 服务器上
      if (currentPckVersion === pckJson.version) {
        console.log('\nNew pck version had discovered.'.green)
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
              body = JSON.parse(body)
              if (body.code === 200) {
                console.log(`\nThe component had published.`.green)
              } else {
                consoel.log(`\nbscpm ${'ERR!'} ${body.message}`)
              }
            }
          }
        )
      } else {
        console.log(`bscpm ${'ERR!'.red} The new pck diff is different, please wait. [ ${currentPckVersion} diff ${pckJson.version} ]`)
        console.log(`If the version which in package.json is different with npm‘s online-version, you must sync it.`)
      }
    }, 500)
  }
}

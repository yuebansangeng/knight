
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

  // constructor (args, opts) {
  //   super(args, opts)
  //   this.isNpmLogined = false
  // }

  // configuring () {
  //   let name = this.config.get('name')
  //   let password = this.config.get('password')
  //   let email = this.config.get('email')

  //   // 判断是否登陆了 npm
  //   let { code, stdout } = shelljs.exec(`npm whoami --color always`)

  //   // 未登录成功
  //   if (code !== 0) {
  //     if (!name || !password || !email) {
  //       console.log(`\n需要配置npm账号 [ name, password, email ].`.red)
  //       console.log(`bscpm set name: [name]`)
  //       console.log(`bscpm set password: [password]`)
  //       console.log(`bscpm set email: [email]\n`)
  //       return
  //     } else {
  //       // 登陆 npm
  //       npmLogin(name, password, email)
  //     }
  //   } else {
  //     // npm 登陆的账号并不是所配置的，切换账号
  //     // stdout 默认会带有换行符号
  //     if (stdout.replace(/\n/ig, '') !== name) {
  //       console.log(`当前npm登录中的用户，不是beisencorp用户（${ stdout }），已在尝试重新登录.`.yellow)
  //       shelljs.exec(`npm logout --color always`)
  //       npmLogin(name, password, email)
  //     }
  //   }

  //   console.log(`\nNpm已登录，用户名: ${name}`.green)

  //   this.isNpmLogined = true
  // }

  writing () {
    // if (!this.isNpmLogined) return

    if (!this.config.get('publish')) {
      console.log('需要设置组件发布的地址（`bscpm set publish:[url]`)'.red)
      return
    }

    let pckcnt = fs.readFileSync(`${this.contextRoot}/package.json`, 'utf8')

    // 转换文本到 json 对象，同时验证格式是否正确，并会返回错误ERR
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
        console.log('\n组件Npm新版本已发布成功.'.green)
        clearInterval(inter)

        request.post({
          'url': this.config.get('publish'),
          'formData': {
            'readme': fs.createReadStream(`${this.contextRoot}/README.md`),
            'package': fs.createReadStream(`${this.contextRoot}/package.json`),
            'editableProps': fs.createReadStream(`${this.contextRoot}/.build/.publish`),
            'qualityReport': fs.createReadStream(`${this.contextRoot}/.build/.quality-report.html`)
          }
        },
        (e, r, body) => {
          if (e) {
            console.log(e)
          } else {
            body = JSON.parse(body)
            if (body.code === 200) {
              console.log(`\n组件发布成功.`.green)
            } else {
              console.log(`\nbscpm ${'ERR!'} ${body.message}`)
            }
          }
        })
      } else {
        console.log('组件正在发布中.'.yellow)
      }
    }, 500)
  }
}

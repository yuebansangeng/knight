
var Generator = require('yeoman-generator')
var jsonfile = require('jsonfile')
var shelljs = require('shelljs')
var os = require('object-assign')
var request = require('request')
var colors = require('colors')
var jsonlint = require("jsonlint")
var fs = require('fs')

module.exports = class extends Generator {

  writing () {

    if (!this.config.get('publish')) {
      console.log('需要设置组件发布的地址（`bscpm set publish:[url]`)'.red)
      return
    }

    let pckcnt = fs.readFileSync(`${this.contextRoot}/package.json`, 'utf8')

    // 转换文本到 json 对象，同时验证格式是否正确，并会返回错误ERR
    let pckJson = jsonlint.parse(pckcnt)

    // 生成 es5 代码
    if (this.options.rebuild) {
      shelljs.exec(`npm run build:publish --color always`)
    }

    // 发布组件到 npm 服务器
    var { code, stdout } = shelljs.exec(`cd ${this.contextRoot} && npm publish --access=public --color always`)
    if (code !== 0) {
      if (this.options.force) {
        // 强制状态，不组织组件继续发布
      } else {
        return false
      }
    }

    // 只发布组件到 NPM 上
    if (this.options.npmOnly) {
      return true
    }

    // 持续抓包，检测新的包已经发布到了 npm 上
    var inter = setInterval(() => {

      if (!this.options.force) {
        // 检测组件的版本是否已经发布
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
          this._private_post()

        } else {
          console.log('组件正在发布中.'.yellow)
        }
      } else {
        clearInterval(inter)
        this._private_post()
      }
    }, 500)
  }

  _private_post () {
    request.post({
      'url': this.config.get('publish'),
      'formData': os(
        this._private_getFormData('readme', 'README.md'),
        // this._private_getDocs('documents_', pckJson),
        this._private_getFormData('package', 'package.json'),
        this._private_getFormData('editableProps', '.build/.publish'),
        this._private_getFormData('qualityReport', '.build/.quality-report.html'),
        this._private_getFormData('examples', '.build/.examples'),
        this._private_getExamples(),
        this._private_getFormData('rc', '.bscpmrc'),
      )
    },
    (e, r, body) => {
      if (e) {
        console.log(e)
      } else {
        body = JSON.parse(body)
        if (body.code === 200) {
          console.log(`\n共享库发布成功.`.green)

        } else {
          console.log(`\n${body.message}，共享库发布失败`.red)
        }
      }
    })
  }

  _private_getExamples () {
    let data = {}
    let fileContent = fs.readFileSync(`${this.contextRoot}/.build/.examples`)
    let examplesJson = JSON.parse(fileContent)
    examplesJson.forEach(({ name }) => {
      os(
        data,
        this._private_getFormData(`example_screenshot_${name}`, `.build/.screenshot/${name}.png`),
        this._private_getFormData(`example_css_${name}`, `examples/${name}/index.css`),
        this._private_getFormData(`example_code_${name}`, `examples/${name}/index.js`)
      )
    })
    return data
  }

  // 读取文件
  _private_getFormData (fieldname, filepath) {
    filepath = filepath.replace(/^\.\//, '')
    var fullFilePath = `${this.contextRoot}/${filepath}`
    if (!fs.existsSync(fullFilePath)) {
      // console.log(`未找到文件: ${fullFilePath}`.yellow)
      return {}
    }
    return {
      [fieldname]: fs.createReadStream(fullFilePath)
    }
  }
}

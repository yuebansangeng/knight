
const Generator = require('yeoman-generator')
const { spawn, spawnSync, execSync } = require('child_process')
const fs = require('fs')
const request = require('request')
const colors = require('colors')

module.exports = class extends Generator {

  writing () {
    // 生成 es5 代码
    // 同步执行，发布前需要先生成es5，不可异步执行
    if (this.options.rebuild) {
      console.log(`bscpm ${'Starting'.yellow} es5 rebuild`)
      spawnSync('npm', [ 'run', 'build:publish', '--color', 'always' ])
      console.log(`bscpm ${'Finished'.green} es5 rebuild`)
    }

    // 发布组件到 npm 服务器
    // 默认情况下不发布，需要添加参数: -p
    if (this.options.npmPublish) {
      let snp = spawnSync('npm', [ 'publish', '--access=public', '--color', 'always' ])
      if (snp.status === 0) {
        console.log(snp.stdout.toString())
      } else {
        if (this.options.force) {
          // 强制状态，不组织组件继续发布
          // 强制状态不输出发布失败信息
        } else {
          console.log(snp.stderr.toString())
          return false
        }
      }
    }

    // 只发布组件到 NPM 上
    if (this.options.npmOnly) {
      return true
    }

    console.log(`bscpm ${'Starting'.yellow} package compress`)

    // 压缩项目，提交到服务器
    let np = spawnSync('npm', [ 'pack' ])

    // 获取当前组件包信息
    let packinfo = require(`${this.contextRoot}/package.json`)

    // 压缩后的包名称
    // npm pack 不可以重新定义 tgz 的名称
    // 转 Buffer 到字符，并且去掉前后空格换行，等
    let tarfile = execSync(`ls | grep ${packinfo.version}\.tgz`).toString().replace(/^\s+|[\s\n\r]+$/, '')
    console.log(`bscpm ${'Finished'.green} package compress`)

    // 开始发布组件到共享中心
    console.log(`bscpm ${'Starting'.yellow} publishing`)

    let tgzStream = fs.createReadStream(`${this.contextRoot}/${tarfile}`)

    // 删除没用的文件
    spawn('rm', [ tarfile ])

    request.post({
      // name & version 放在 query 中传递
      // 未找到 request.post 传递参数的方式
      'url': `http://cmp.beisen.io/users/publish?name=${packinfo.name}&version=${packinfo.version}`,
      'formData': {
        'pack.tgz': tgzStream
      }
    },
    (err, resp, body) => {
      if (err) {
        console.log(`bscpm ${'Error'.red} publishing`)
        return console.log(`${err.message}`.red)
      }

      // 处理结果返回值
      let { code, message, data } = JSON.parse(body)

      if (code === 200) {
        console.log(`bscpm ${'Finished'.green} publishing`)

        // 写入组件id，用于组件发布时的唯一性匹配
        let { 'id': cmpId } = data
        let bscpmrcJson = require(`${this.contextRoot}/.bscpmrc.json`)

        // !：新发布的组件不带有 id
        // !==：修改过名字的组件
        // 重新生成带有组件 id 的 rc 配置文件
        if (!bscpmrcJson.id || bscpmrcJson.id !== cmpId) {
          console.log(`bscpm ${'Starting'.yellow} cmp id updating`)

          let bscpmrcContent = JSON.stringify(bscpmrcJson, null, 2)
          fs.writeFileSync(`${this.contextRoot}/.bscpmrc.json`, bscpmrcContent, 'utf8')  

          console.log(`bscpm ${'Finished'.green} cmp id updating: ${bscpmrcJson.id}`)
        }

      } else {
        console.log(`bscpm ${'Error'.red} publishing`)
        console.log(message)
      }
    })
  }
}

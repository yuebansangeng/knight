
import Generator from 'yeoman-generator'
import { spawn } from 'child_process'
import Promise from 'bluebird'
import path from 'path'

// 应公司内部运维要求，静态资源统一机器发布
// 生成完静态资源文件后，上传到指定服务器后，需要调用该任务，发布资源文件到 stnew03

export default class extends Generator {

  async writing () {
    await new Promise((resolve, reject) => {

      // 环境中获取提前配置好的 jenkins 账号
      let {
        'JENKINS_DEPLOYUSER': deployuser,
        'JENKINS_RSYNC_JOB': jenkinsRsyncJob
      } = process.env

      let curl_cp = spawn('curl', [
        '-X',
        'POST',
        jenkinsRsyncJob,
        '--user',
        deployuser
      ])

      curl_cp.stdout.on('data', data => console.log(`${data}`))
      curl_cp.stderr.on('data', data => console.log(`${data}`))

      curl_cp.on('close', code => {
        resolve(code)
      })
    })
  }
}

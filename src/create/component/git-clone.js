
import { spawn } from 'child_process'

const timeout = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Gitlab 刚创建的完毕的项目可能会出现找不到的情况
// 避免该情况，当出现找不到的异常时，重复获取5次尝试
const gitclone = (num, group, project, messages) => {
  const { GITLAB_HOST } = process.env

  return new Promise(async (resolve, reject) => {
    if (num === -1) {
      console.log(messages.join('')) 
      return resolve(false)
    }

    // console.log(`Gitlab 中未找到 '${project}' 项目，正在重新尝试获取`)
    // 只缓存最后一次记录的msg
    messages = []

    // close项目
    let code = await new Promise((resolve, reject) => {
      console.log(`git@${GITLAB_HOST}:${group}/${project}.git`)
      let cp_g = spawn('git', [ 'clone', `git@${GITLAB_HOST}:${group}/${project}.git` ])
      cp_g.stdout.on('data', m => messages.push(`${m}`))
      cp_g.stderr.on('data', m => messages.push(`${m}`))
      cp_g.on('close', code => {
        resolve(code)
      })
    })

    if (code !== 0){
      if (messages.join('').match(/Could not read from remote repository/g)) {
        num--
        await timeout(500)
        let status = await gitclone(num, group, project, messages)
        return resolve(status)
      } else {
        console.log(messages.join(''))
        return resolve(false)
      }
    } else {
      return resolve(true)
    }
  })
}

export default gitclone

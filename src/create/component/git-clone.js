
import { spawn } from 'child_process'

// Gitlab 刚创建的完毕的项目可能会出现找不到的情况
// 避免该情况，当出现找不到的异常时，重复获取5次尝试
const gitclone = async (num, group, project, messages) => {
  if (num === -1) {
    console.log(messages.join('')) 
    return false
  }

  // 只缓存最后一次记录的msg
  messages = []

  // close项目
  let code = await new Promise((resolve, reject) => {
    let cp_g = spawn('git', [ 'clone', `git@gitlab.beisencorp.com:${group}/${project}.git` ])
    cp_g.stdout.on('data', m => messages.push(`${m}`))
    cp_g.stderr.on('data', m => messages.push(`${m}`))
    cp_g.on('close', code => {
      resolve(code)
    })
  })

  if (code !== 0){
    if (messages.join('').match(/fatal: Could not read from remote repository/g)) {
      num--
      setTimeout(() => gitclone(num, group, project, messages), 500)
    } else {
      console.log(messages.join(''))
      return false
    }
  } else {
    return true
  }
}

export default gitclone

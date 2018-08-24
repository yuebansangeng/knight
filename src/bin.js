
import path from 'path'
import program from 'commander'
import yeomanEnv from 'yeoman-environment'
import upgradeMsg from '../lib/upgrade-msg'
import pckJson from '../package.json'
import dotenv from 'dotenv'

dotenv.config({ 'path': path.join(__dirname, '..', '.env') })

const env = yeomanEnv.createEnv()
  .register(require.resolve('../lib/create'), 'create')
  .register(require.resolve('../lib/run'), 'run')

program
  .version(pckJson.version, '-v, --version')

program
  .command('create')
  .option('-u, --username [username]', 'Gitlab账号名，创建项目时添加最高权限的用户，默认是当前机器上的 git user.name')
  .description('脚手架工具生成解决方案')
  .action(async (opts) => {
    await upgradeMsg()
    let { username } = opts
    // 当前create命令还只支持组件项目，之后会逐步增加其他解决方案
    env.run('create component', { username })
  })

program
  .command('run <cmd>')
  .option('-f, --force [force]', '强制生成文档 [docgen]')
  .option('-c, --cinumber [cinumber]', 'Jenkins构建任务的编号 [record, build-after-notice]')
  .option('-t, --to [to]', '邮件发送地址 [build-after-notice]')
  .option('-s, --status [status]', 'Jenkins构建任务状态 [build-after-notice]')
  .option('-j, --jobname [jobname]', 'Jenkins构建任务名 [record]')
  .description('组件构建相关的命令：build, build-after-notice, build-storybook, check, docgen, login, publish, rcgen, record, rsync-statics')
  .action((cmd, opts) => {
    // 不可以直接把opts传入run函数的第二个参数，会报错
    let { force, cinumber, jobname, to, status } = opts
    env.run(`run ${cmd}`, { force, cinumber, jobname, to, status })
  })

program.parse(process.argv)

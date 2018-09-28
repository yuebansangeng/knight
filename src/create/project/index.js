import fs from 'fs'
import Generator from 'yeoman-generator'
import request from 'request'
import { spawnSync } from 'child_process'
import gitclone from './git-clone'
import { execSync } from 'child_process'

export default class extends Generator {
  prompting(){
    let { username } = this.options
    // 如果为传递用户名，则自动获取，用于给Gitlab项目添加权限
    if (!username) {
      const { stdout } = spawnSync('git', ['config', 'user.name'])
      username = `${stdout}`.replace(/^\s+|\s+$/, '')
    }
    return this.prompt([
      {
        'type': 'input',
        'name': 'projectName',
        'message': '项目名字 ( 可使用小写英文、数字、中划线 )：',
        'validate': function (value) {
          if (!value.match(/^[a-z\-\d]+?$/)) {
            return '项目名称格式不正确, 只能包含小写英文、数字、中划线'
          }
          return true;
        }
      },
      {
        'type': 'confirm',
        'name': 'isSyncGitlab',
        'message': '是否在gitlab上创建该项目',
        'default': true
      },
      {
        'type': 'input',
        'name': 'group',
        'message': '项目分组：',
        'default': 'ux-share-platform',
        'when': function(answers) { // 当isSyncGitlab为true的时候才会提问当前问题
          return answers.isSyncGitlab
        }
      },
      {
        'type': 'input',
        'name': 'description',
        'message': '项目描述：'
      }
    ]).then(promptes => {
      let { projectName, description, group } = promptes
      this.promptes = promptes
      this.promptes.projectName = projectName
      //通过git获取
      this.promptes.username = username
      this.promptes.group = group
      this.promptes.description = description
      this.promptes.repository = ''
      //this.promptes = Object.assign({},promptes)
    })
  }
  writing() {
    const { CMP_SERVER_HOST } = process.env
    let { projectName, isSyncGitlab, username, group} = this.promptes
    if(!isSyncGitlab){
        if(!fs.existsSync(projectName)){
          fs.mkdir(projectName)
        } else { 
          let files = fs.readdirSync(projectName).filter(filename => filename !== '.git')
          if (files.length) {
            return console.log(`fatal: destination path '${projectName}' already exists and is not an empty directory.\n`)
          }
        }
        // 创建、安装
        this._copyTemplateFiles()
        this._installPkg()
        return
      }
      request(`${CMP_SERVER_HOST}/users/create-project?project=${projectName}&username=${username}&group=${group}`, (err, resp, body) => {
        if (err) {
          throw new Error(`${'Error'.red} gitlab上已有该项目|项目创建失败`)
        }
        const { code, message, data = {} } = JSON.parse(body)
  
        // 如果接口中返回非200，异常，则提示错误
        if (code !== 200) {
          let msg = `${message}, 可能是username缺失，如果没有配置 git user.name，可使用 --username 添加Gitlab用户名`
          throw new Error(msg)
        }
  
        // 执行clone项目
        gitclone(5, data.group, projectName)
          .then(statue => {
            if (statue) {
              // 获取项目地址
              let repository = execSync(`git remote get-url --push origin`, { 'cwd':`${this.options.contextRoot}/${this.promptes.projectName}`})
              this.promptes.repository = `${repository}`.replace('\n','')
  
              // 生成模版
              this._copyTemplateFiles()
              this._installPkg()
            } else {
              console.log('clone项目出现异常，请重试或手动操作')
            }
          })
        })
      }

    _copyTemplateFiles(){
        this._private_copies([
          ['gitignore', '.gitignore'], // npm publish，会忽略 .gitignore 文件
          ['package.json','package.json'],
          ['index.js', 'src/index.js'],
          ['bscpmrc', '.bscpmrc'],
          ['README.md']
        ])
    }
    
    _installPkg() {
      // 跳转至当前组件项目路径下
      process.chdir(`${this.promptes.projectName}`)

      // }
      this.yarnInstall(
        [
          "react@15.6.2",
          "react-dom@15.6.2"
        ],{
          'W':true
        }
      )
      this.yarnInstall(
        [
          '@beisen/storybook-lib@latest',
          "react@15.6.2",
          "react-dom@15.6.2"
        ], {
          'dev': true
        }
      )
    }


    _private_copies(copyJobs = []) {
      copyJobs.forEach(([ tplFilePath, destFilePath ]) => {
        if (!destFilePath) {
          destFilePath = tplFilePath
        }
        if (!tplFilePath) throw new Error('tplFilePath is none')
        if (!destFilePath) throw new Error('destFilePath is none')
  
        // 改变路径为项目目录下
        // if (this.promptes.isSyncGitlab) {
        destFilePath = `${this.promptes.projectName}/${destFilePath}`
        // }
         this.fs.copyTpl(
          this.templatePath(tplFilePath),
          this.destinationPath(`${this.options.contextRoot}/${destFilePath}`),
          this.promptes
        )
    })
  }
}
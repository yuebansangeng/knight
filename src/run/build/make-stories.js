
const ejs = require('ejs')
const path = require('path')
const fs = require('fs')
const { getCmpName, getDemos } = require('./utils')

// cpath 组件调用命令传入的路径
let cpath = process.cwd()

ejs.renderFile(
  path.join(__dirname, '..', 'src', 'templates', 'stories.ejs'),
  {
    'examples': getDemos(path.join(cpath, 'examples')),
    'cmpName': getCmpName(path.join(cpath, 'package.json'))
  },
  { }, // ejs options
  (err, storiesjs) => {
    if (err) throw err
    
    // 创建 .build 文件夹
    const buildFolderPath = path.join(cpath, '.build')
    if (!fs.existsSync(buildFolderPath)) {
      fs.mkdirSync(buildFolderPath)
    }

    // 在组建项目中创建配置文件
    fs.writeFile(path.join(cpath, '.build', '.stories.js'), storiesjs, (err) => {
      if (err) throw err
      // console.log('the stories file is saved!')
    })
  }
)

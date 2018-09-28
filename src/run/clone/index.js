import gitclone from '../clone/git-clone'
import fs from 'fs'
import Generator from 'yeoman-generator'

export default class extends Generator {
    writing() {
        fs.readFile('./rc.json', { encoding: 'utf-8'}, function(err,data){
            if (err) throw 'error:失败，请在根目录下添加rc.json文件'
            let rc = JSON.parse(data)
            // 执行clone项目
            gitclone( rc.registries, rc.dir)
        })
    }
}

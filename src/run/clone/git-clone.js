
import { spawn,execSync } from 'child_process'
import fs from 'fs'

const gitclone = (clone=[],path) => {
    if(path && !fs.existsSync(path)){
        fs.mkdirSync(path)
    }
    process.chdir(path)
    const promises = clone.map(item => {
        return new Promise((resolve,reject)=>{
            let cp_g = spawn('git', [ 'clone', item.git ])
            cp_g.on('close', data => {
                //删除.git文件
                execSync('rm -rf .git .gitignore',{cwd: item.git.split('/')[1].split('.')[0]})
                //给文件改名
                if(item.name){
                    fs.rename(item.git.split('/')[1].split('.')[0], item.name, function(err) {
                        if ( err ) console.log('ERROR: ' + err);
                    });   
                }
                return resolve(data)
              });
        })
    })
    Promise.all(promises).then(()=> console.log('ok')).catch(()=>{throw new Error()})
}
export default gitclone

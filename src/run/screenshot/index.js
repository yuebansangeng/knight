
import path from 'path'
import Generator from 'yeoman-generator'

export default class extends Generator {

  // 统一添加前缀组件模块前缀
  async writing () {
    const { CMP_SERVER_HOST } = process.env
    let { name } = this.options.rc
    let { 'name': module, version } = this.options.package

    function print (chilprocess) {
      chilprocess.stdout.on('data', data => console.log(`${data}`.green))
      chilprocess.stderr.on('data', data => console.log(`${data}`.yellow))
    }

    print(spawn('node', ['make-stories.js', cpath], { 'cwd': __dirname }))
    print(spawn('node', ['make-demos.js', cpath], { 'cwd': __dirname }))

    print(spawn('gulp', [], { 'cwd': cpath }))

    print(spawn('node', ['make-config.js', cpath], { 'cwd': __dirname }))

    spawn(
      'storybook-chrome-screenshot',
      [
        '-p', '9001',
        '-c', `${path.join(__dirname, '..', 'src')}`,
        '-o', `${cpath}/.build/.screenshot`
      ]
    )
  }
}

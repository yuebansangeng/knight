
var objectAssign = require('object-assign')
var Generator = require('yeoman-generator')

module.exports = class extends Generator {

  prompting () {
    return this.prompt([
      {
        type: 'list',
        name: 'category',
        choices: [ 'Component', 'Units' ],
        message: 'Pick your solution.'
      }
    ]).then(promptes => {
      this.promptes = promptes
    })
  }

  writing () {
    if (this.promptes.category === 'Component') {
      this.composeWith(
        require.resolve('../component/index.js'),
        // 子命令中，通过this.contextRoot取不到工作目录
        objectAssign({ contextRoot: this.contextRoot }, this.promptes)
      )
    }
  }
}

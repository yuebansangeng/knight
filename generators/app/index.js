
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
        this.promptes
      )
    }
  }
}

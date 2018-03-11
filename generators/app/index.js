
var Generator = require('yeoman-generator')

module.exports = class extends Generator {

  initializing () {
  	this.log('initializing')
  }

  prompting() {
  	return this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'This is your component name on flying.'
      }, {
        type: 'list',
        name: 'type',
        choices: [ 'Normal Component', 'Shared Component', 'Application Component' ],
        message: 'This is your component type.'
      }, {
        type: 'input',
        name: 'moduleName',
        message: 'This is your component moudle name which use on dependencies manage.'
      }
    ]).then(promptes => {
      this.promptes = promptes
      console.log(this.promptes)
    });
  }

  configuring () {

  }

  writing () {
  	this._private_copies([
      [ 'index.js', 'src/index.js' ],
      [ 'package.json' ],
      [ 'webpack.config.js' ],
      [ '.gitignore' ]
    ])

    if (this.promptes.type === 'Shared Component') {
      this._private_copies([ '.gitlab-ci.yml' ])
    }
  }

  install () {
  	// this.npmInstall([
   //      'babel-loader',
   //      'babel-core'
   //    ],
   //    { 'save-dev': true }
   //  )
  }

  end () {

  }

  _private_copies (copyJobs = []) {
    copyJobs.forEach(([ tplFilePath, destFilePath, tplData = {} ]) => {
      if (!destFilePath) {
        destFilePath = tplFilePath
      }
      this.fs.copyTpl(
        this.templatePath(tplFilePath),
        this.destinationPath(`${this.contextRoot}/${destFilePath}`),
        this.promptes
      )
    })
  }
}
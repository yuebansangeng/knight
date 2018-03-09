
var Generator = require('yeoman-generator');
var shelljs = require('shelljs')

module.exports = class extends Generator {

  initializing () {
  	console.log('initializing')
  }

  prompting() {
  	return this.prompt([{
      type    : 'input',
      name    : 'name',
      message : 'Your project name',
      default : this.appname // Default to current folder name
    }, {
      type    : 'confirm',
      name    : 'cool',
      message : 'Would you like to enable the Cool feature?'
    }]).then((answers) => {
      this.log('app name', answers.name);
      this.log('cool feature', answers.cool);
    });
  }

  configuring () {
  	console.log('configuring')
  }

  default () {
  	console.log('default')
  }

  writing () {
  	console.log('writing')
  }

  conflicts () {
  	console.log('conflicts')
  }

  install () {
  	console.log('install')
  }

  end () {
  	console.log('end')
  }
}
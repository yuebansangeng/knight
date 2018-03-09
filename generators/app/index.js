
var Generator = require('yeoman-generator');
var shelljs = require('shelljs')

module.exports = class extends Generator {

  constructor(args, opts) {
    super(args, opts);

    // This makes `appname` a required argument.
    this.argument('appname', {
      type: String,
      // required: true,
      desc: 'this is a desc content',
      default: 'default_value'
    });

    this.option('coffee');
    this.scriptSuffix = (this.options.coffee ? ".coffee": ".js");
    this.log(this.scriptSuffix)
  }

  initializing () {
  	this.log('initializing')
  }

  prompting() {
  	return this.prompt([{
      type    : 'input',
      name    : 'name',
      message : 'Your project name',
      default : this.appname, // Default to current folder name
      store   : true
    }, {
      type    : 'confirm',
      name    : 'cool',
      message : 'Would you like to enable the Cool feature?',
      store   : true
    }]).then((answers) => {
      this.log('app name', answers.name);
      this.log('cool feature', answers.cool);
    });
  }

  configuring () {

  }

  default () {
  }

  writing () {
  	// /Users/zhangyue/index.js
  	this.log(this.destinationPath('index.js'))
  	// /Users/zhangyue/GithubApplications/generator-standard-cmp
  	this.log(this.contextRoot)
  	// /Users/zhangyue/GithubApplications/generator-standard-cmp/generators/app/templates/index.js
  	this.log(this.templatePath('index.js'))
  	// /Users/zhangyue/GithubApplications/generator-standard-cmp/generators/app/templates
  	this.log(this.sourceRoot())

  	this.fs.copyTpl(
      this.templatePath('index.html'),
      this.destinationPath(`${this.contextRoot}/public/index.html`),
      { title: 'Templating with Yeoman' }
    );
  }

  conflicts () {
  }

  install () {
  	// this.npmInstall(['lodash'], { 'save-dev': true });
  }

  end () {
  }
}
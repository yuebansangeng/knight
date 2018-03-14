
var Generator = require('yeoman-generator')

module.exports = class extends Generator {
  
  constructor (args, opts) {
    super(args, opts)
    // propName:propValue
    this.argument('storedData', { type: String, required: true })
  }

  configuring () {
    var ss = this.options.storedData.split(':')
    this.config.set({
      [ss[0]]: ss.slice(1).join(':')
    })
  }
}

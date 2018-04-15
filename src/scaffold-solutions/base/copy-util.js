
/*
  * 封装copy（API），减少代码量
  * 28原则：百分之20%的代码解决80%的功能
  * 函数名前面添加下滑线，告知Yeoman不自定执行改函数
*/
module.exports = function (copyJobs = []) {
  copyJobs.forEach(([ tplFilePath, destFilePath, tplData = {} ]) => {
    if (!destFilePath) {
      destFilePath = tplFilePath
    }
    if (!tplFilePath) throw new Error('tplFilePath is none')
    if (!destFilePath) throw new Error('destFilePath is none')

    this.fs.copyTpl(
      this.templatePath(tplFilePath),
      this.destinationPath(`${this.options.contextRoot}/${destFilePath}`),
      this.promptes
    )
  })
}

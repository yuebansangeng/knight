# paas-components-template

## How to useage

### 基础配置

* 配置`.gitlab-ci.yml`
  
  从组件模板项目中拷贝`.gitlab-ci.yml`，根据`组件npm包名`和`对外暴露的字段`，在`.gitalab-ci.yml`中修改`importName`>和`importModule`的值
  
### 提交

* 修改`package.json`中的`version`，为npm包版本和git tag版本
* 本地执行`npm run build`
* `git -am 'some message'`
* `git push`
* `git tag xx`
* `git push origin xx`
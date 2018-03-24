
/*
* 和开发环境环境有关的变量
*/
export default {

  // 表示开发态，具体指带Pagebuilder
  // 在Pagebuilder中，所有的组件外面都是被包裹一个div.develop-env-pgb-wrapper
  // 具体要在Pagebuilder中特殊化的样式，可以使用 .develop-env-pgb-wrapper .[class] 的方式
  // todo：需要提出来成运行时配置文件，否则class无法更换
  'develop': {
    'className': 'develop-env-pgb-wrapper'
  },

  // 运行态环境
  'runtime': {}
}

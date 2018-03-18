
import React, { Component } from 'react'

export default class extends Component {
  /*
  * 不可修改函数
  * 对于Pagebuilder来说，实现容器节点必须要使用connectPlaceholder属性
  * 为了去除connectPlaceholder在运行态和开发态的不兼容性
  */
  connectPlaceholder () {
    let { connectPlaceholder } = this.props
    // 在开发态环境中，肯定传入了该属性，则直接返回
    if (connectPlaceholder) return connectPlaceholder
    // 运行态环境，直接返回Dom对象
    return (containerName) => (containerDom) => {
      return containerDom
    }
  }
}

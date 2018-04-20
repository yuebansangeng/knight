
import React, { Component } from 'react'

export default class extends Component {
  /*
  * 不可修改函数
  * 对于Pagebuilder来说，实现容器节点必须要使用connectPlaceholder属性
  * 为了去除connectPlaceholder在运行态和开发态的不兼容性
  */
  slot (name, props) {
    let { connectPlaceholder } = this.props
    if (connectPlaceholder) {
      return connectPlaceholder(name)(<div { ...props }></div>)
    }
    let { children } = this.props
    let childs = children ? Array.isArray(children) ? this.props.children : [this.props.children] : []
    return <div { ...props }>{
      childs.filter(({ props = {} }) => props.slot === name)
    }</div>
  }
}


import React, { Component } from 'react'

export default class extends Component {

  constructor (props) {
    super(props)
    // 布局组件需要配置该属性
    this.componentHolder = true
  }

  render () {
  	// 布局组件需要使用props上的connectPlaceholder属性初始化容器节点
  	let { connectPlaceholder } = this.props
    return (
      { connectPlaceholder('container')(<div className="container"></div>) }
    )
  }
}

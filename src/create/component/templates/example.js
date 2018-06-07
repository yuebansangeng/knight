
import React, { Component } from 'react'
// @ 会默认获取当前组件
import DefaultComponent from '@component'

export default class extends Component {
  render () {
    return <DefaultComponent {...this.props} />
  }
}

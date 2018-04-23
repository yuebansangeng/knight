
import DefaultComponent from '../../src'
import React, { Component } from 'react'

export default class extends Component {
  render () {
    return <DefaultComponent {...this.props} />
  }
}

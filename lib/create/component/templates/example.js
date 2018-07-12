
import React, { Component } from 'react'
import DefaultComponent from '../../src'

export default class extends Component {
  render () {
    return <DefaultComponent {...this.props} />
  }
}

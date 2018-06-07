
import React, { Component } from 'react'
import DefaultComponent from '../../lib'

export default class extends Component {
  render () {
    return <DefaultComponent {...this.props} />
  }
}

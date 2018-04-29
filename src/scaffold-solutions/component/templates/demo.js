
import DefaultComponent from '../../lib'
import React, { Component } from 'react'

export default class extends Component {
  render () {
    return <DefaultComponent {...this.props} />
  }
}

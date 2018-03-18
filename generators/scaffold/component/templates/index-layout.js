
import React, { Component } from 'react'
import BaseComponent from './BaseComponent'

export default class extends BaseComponent {
  render () {
    return this.connectPlaceholder('container')(
      <div className="container">
        { this.props.children }
      </div>
    )
  }
}

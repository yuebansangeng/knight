import React, {Component, PropTypes} from 'react'
import {render} from 'react-dom'

import App from '../lib/index.js';

class Demo extends Component{
  render () {
    return (
      <div>
      	  <App />
      </div>
    )
  }
}

module.exports = Demo;
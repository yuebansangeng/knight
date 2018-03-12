
import { storiesOf, configure } from '@storybook/react'

import React from 'react'
window.React = React

import Component from '../src/index.js'

configure(
  () => {
    let mpStoires = storiesOf('<%= cmpName %>', module)
      .add('default', () => <Component />)
  },
  module
)

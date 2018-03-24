
import { storiesOf, configure } from '@storybook/react'
import { stories, readme } from './index.js'
import stories from './stories'

import Component from '../src/index.js'

import React from 'react'
window.React = React

configure(
  () => {
    let storiesInstence = storiesOf('<%= cmpName %>', module)
    stories(Component).forEach(({ name, story }) => {
      storiesInstence.add(name, story)
    })
  },
  module
)

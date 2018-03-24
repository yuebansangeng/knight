
import { storiesOf, configure } from '@storybook/react'
import { stories, readme } from './index.js'

import React from 'react'
window.React = React

configure(
  () => {
    let storiesInstence = storiesOf('<%= cmpName %>', module)
    stories.forEach(({ name, story }) => {
      storiesInstence.add(name, story)
    })
  },
  module
)

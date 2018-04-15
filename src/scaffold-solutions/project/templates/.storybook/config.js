
import { storiesOf, configure } from '@storybook/react'
import storiesConf from './stories'

import Project from '../src/index.js'

import React from 'react'
window.React = React

configure(
  () => {
  	let { name, stories } = storiesConf(Project)
    let storiesInstence = storiesOf(name, module)
    stories.forEach(({ name, story }) => {
      storiesInstence.add(name, story)
    })
  },
  module
)

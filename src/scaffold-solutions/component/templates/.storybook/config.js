
import { storiesOf, configure } from '@storybook/react'

import { withKnobs } from '@storybook/addon-knobs/react';
import { withDocs }  from 'storybook-readme'
import { stories, readme, name } from './index.js'

import handleType from './util'

import React from 'react'
window.React = React

configure(
  () => {
    let storiesInstence = storiesOf(name, module)
    storiesInstence.addDecorator(withKnobs);
    stories.forEach(({ name, story }) => {
      const { content: Component, editProps, style, className } = story
      storiesInstence.add(name, withDocs(readme, () => {
      	const params = handleType(editProps)
  	 	return (
	 		<div className={className} style={style}>
	          <Component {...params} />
	        </div>
        )
  	 }))
    })
  },
  module
)

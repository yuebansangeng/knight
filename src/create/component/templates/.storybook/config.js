
import { storiesOf, configure } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs/react';
import { withDocs, withReadme }  from 'storybook-readme'
import { stories, name, readme } from '../.build/.stories.js'
import handleType from './util'

configure(
  () => {
    let storiesInstence = storiesOf(name, module)
    storiesInstence.addDecorator(withKnobs);
    storiesInstence.addDecorator(withReadme([readme]))

    stories.forEach(({ name, story }) => {
      const { content: Component, editableProps, doc = '' } = story

      storiesInstence.add(name, withDocs(doc, () => {
        const params = handleType(editableProps)
        return <Component {...params} />
      }))
    })
  },
  module
)

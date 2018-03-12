
import Component from '../src/index.js'
import readme from '../README.md'
import { withReadme, withDocs }  from 'storybook-readme'

export default {
  // 开发可以定义多个 DEMO/STORY
  'stories': [{
    'name': 'default',
    'story': withDocs(readme, () => <Component />)
  }],
  // loc
  readme
}

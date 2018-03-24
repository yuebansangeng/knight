
import readme from '../README.md'
import { withReadme, withDocs }  from 'storybook-readme'
import { develop, runtime } from './env'

export default (Component) => {
  return {
    name: '<%= cmpName %>',
    // 开发可以定义多个 DEMO/STORY
    'stories': [{
      'name': 'default',
      'story': withDocs(readme, () => <div className={develop.className}>
          <Component />
        </div>)
    }],
    // loc
    readme
  }
}

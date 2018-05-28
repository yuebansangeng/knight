
import readme from '../README.md'
import { withReadme, withDocs }  from 'storybook-readme'

export default (Project) => {
  return {
    name: '<%= projectName %>',
    // 开发可以定义多个 DEMO/STORY
    'stories': [{
      'name': 'default',
      'story': withDocs(readme, () => <div>
          <Project />
        </div>)
    }],
    // loc
    readme
  }
}

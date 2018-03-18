
import Component from '../src/index.js'
import readme from '../README.md'
import { withReadme, withDocs }  from 'storybook-readme'

let connectPlaceholder = (containerName) => (containerDom) => {
  return containerDom
}

export default {
  name: '<%= cmpName %>',
  // 开发可以定义多个 DEMO/STORY
  'stories': [{
    'name': 'default',
    'story': withDocs(readme, () => <div className="develop-env-pgb-wrapper">
        <Component connectPlaceholder={connectPlaceholder} />
      </div>)
  }],
  // loc
  readme
}

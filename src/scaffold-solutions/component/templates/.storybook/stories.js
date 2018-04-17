
import readme from '../README.md'
import { develop } from './env'

export default (Component) => {
  return {
    name: '<%= cmpName %>',
    // 开发可以定义多个 DEMO/STORY
    'stories': [{
      'name': 'default',
      'story': {
        content: Component,
        editProps: [],
        className: develop.className,
        style: {}
      }
    }],
    readme
  }
}

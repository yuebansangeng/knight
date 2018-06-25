#! /usr/bin/env node

const { parse, resolver } = require('react-docgen')
const fs = require('fs')
const path = require('path')
const Handlebars = require('handlebars')

const template = Handlebars.compile(`${fs.readFileSync(path.join(__dirname, 'template.handlebars'))}`)

module.exports = function (content) {

  let components = parse(content, resolver.findAllExportedComponentDefinitions)

  components = components.map(component => {
    if (component.description && !component.displayName) {
      component.title = component.description.match(/^(.*)$/m)[0]
      if (component.description.split('\n').length > 1) {
        component.description = component.description.replace(/[\w\W]+?\n+?/, '')
        component.description = component.description.replace(/(\n)/gm, '   \n')
      } else {
        component.description = null
      }
    } else {
      component.title = component.displayName
    }

    if (component.description) {
      component.description = `${component.description}   \n\n`
    }

    // validate default values
    if (component.props) {
      Object.keys(component.props).forEach(key => {
        let obj = component.props[key]

        if (obj.defaultValue && obj.type) {
          const isString = obj.type.name === 'string' && typeof obj.defaultValue.value === 'string'
          const isInvalidValue = (/[^\w\s.&:\-+*,!@%$]+/igm).test(obj.defaultValue.value)
          if (isInvalidValue && !isString) {
            obj.defaultValue.value = '<See the source code>'
          }
        }

        if (obj.description) {
          const processedDescription = obj.description
            .split('\n')
            .map(text => text.replace(/(^\s+|\s+$)/, ''))
            .map(hasValidValue => hasValidValue)
            .join(' ')

          obj.description = processedDescription
        }
      })
    }

    return component
  })

  return template({ components, 'version': '', 'documentTitle': '' })
}

#! /usr/bin/env node
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactDocgen = require('react-docgen');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _handlebars = require('handlebars');

var _handlebars2 = _interopRequireDefault(_handlebars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const template = _handlebars2.default.compile(`${_fs2.default.readFileSync(_path2.default.join(__dirname, 'template.handlebars'))}`);

exports.default = content => {

  let components = (0, _reactDocgen.parse)(content, _reactDocgen.resolver.findAllExportedComponentDefinitions);

  components = components.map(component => {
    if (component.description && !component.displayName) {
      component.title = component.description.match(/^(.*)$/m)[0];
      if (component.description.split('\n').length > 1) {
        component.description = component.description.replace(/[\w\W]+?\n+?/, '');
        component.description = component.description.replace(/(\n)/gm, '   \n');
      } else {
        component.description = null;
      }
    } else {
      component.title = component.displayName;
    }

    if (component.description) {
      component.description = `${component.description}   \n\n`;
    }

    // validate default values
    if (component.props) {
      Object.keys(component.props).forEach(key => {
        let obj = component.props[key];

        if (obj.defaultValue && obj.type) {
          const isString = obj.type.name === 'string' && typeof obj.defaultValue.value === 'string';
          const isInvalidValue = /[^\w\s.&:\-+*,!@%$]+/igm.test(obj.defaultValue.value);
          if (isInvalidValue && !isString) {
            obj.defaultValue.value = '<See the source code>';
          }
        }

        if (obj.description) {
          const processedDescription = obj.description.split('\n').map(text => text.replace(/(^\s+|\s+$)/, '')).map(hasValidValue => hasValidValue).join(' ');

          obj.description = processedDescription;
        }
      });
    }

    return component;
  });

  return template({ components, 'version': '', 'documentTitle': '' });
};

module.exports = exports['default'];
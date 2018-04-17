import {
  number,
  object,
  boolean,
  text,
  select,
  date,
  array,
  color,
  files,
  selectV2
} from '@storybook/addon-knobs/react';

const typeMap = {
  number,
  object,
  boolean,
  text,
  select,
  date,
  array,
  color,
  files,
  selectV2
}

const handleType = (editProps) => {
  let obj = {}
  editProps && editProps.map(({ name, type = '', label = '', defaultValue}) => {
    if (type !== 'selectV2') {
      type = type.toLocaleLowerCase()
    }
    if (!typeMap[type]) return
    obj[name] = typeMap[type](label, defaultValue)
  })
  return obj
}

export default handleType
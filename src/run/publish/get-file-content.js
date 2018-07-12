
import  fs from 'fs'

export default {

  getContent (filepath, utf8 = true) {
    if (!fs.existsSync(filepath)) {
      return null
    }
    return utf8 ? fs.readFileSync(filepath, 'utf8') :
      fs.readFileSync(filepath)
  },

  getJson (filepath, utf8 = true) {
    if (!fs.existsSync(filepath)) {
      return null
    }
    let content = fs.readFileSync(filepath, 'utf8')
    return JSON.parse(content)
  }
}

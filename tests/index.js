
const assert = require('assert')
const upgradeMsg = require('../src/upgrade-msg')

const request = (url, callback) => {
  callback(null, {}, '{"version": "0.8.0"}')
}

describe('upgrade-msg', () => {
  describe('upgrade-msg-passed', () => {
    it('输出正确的版本号', async () => {
      let version = await upgradeMsg(request)
      assert.equal(version, '0.8.0')
    })
  })
})

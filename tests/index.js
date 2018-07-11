
const assert = require('assert')
const upgradeMsg = require('../src/upgrade-msg')

describe('upgrade-msg', () => {
  describe('upgrade-msg-passed', () => {
    it('输出正确的版本号', async () => {
    	let version = await upgradeMsg()
      assert.equal(version, '0.8.0')
    })
  })
})

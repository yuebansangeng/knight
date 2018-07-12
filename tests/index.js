
const assert = require('assert')
const upgradeMsg = require('../lib/upgrade-msg')

// 修改 request 的 hostname mock 到本地测试服务器
process.env.CMP_SERVER_HOST = 'http://127.0.0.1:9010'


describe('工具类测试', () => {
  it('输出Bscpm最新版本号', async () => {
    let version = await upgradeMsg()
    assert.equal(version, '0.8.0')
  })
})

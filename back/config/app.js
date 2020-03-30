module.exports = {
  port: 3000,
  name: 'tms-finder',
  router: {
    auth: {
      prefix: '' // 接口调用url的前缀
    },
    controllers: {
      prefix: '' // 接口调用url的前缀
    },
    fsdomain: {
      prefix: 'fs' // 文件下载服务的前缀
    }
  },
  auth: {
    captcha: { code: 'a1z9' },
    client: { accounts: [{ id: 1, username: 'user1', password: '123456' }] },
    jwt: {
      privateKey: 'tms-finder-secret',
      expiresIn: 7200
    }
  },
  tmsTransaction: false
}

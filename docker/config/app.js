const appConfig = {
  name: process.env.TFD_APP_NAME || 'tms-finder',
  port: process.env.TFD_APP_PORT || 3000,
  router: {
    auth: {
      prefix: 'auth', // 鉴权接口调用url的前缀
    },
    controllers: {
      prefix: 'api', // 接口调用url的前缀
    },
    fsdomain: {
      prefix: 'fs', // 文件下载服务的前缀
    },
  },
  cors: {
    credentials: true,
  },
  auth: {
    // 内置账号
    client: {
      accounts: [{ id: 1, username: 'admin', password: 'admin' }],
    },
    // 保存鉴权信息
    jwt: {
      privateKey: 'tms-finder-secret',
      expiresIn: 3600,
    },
    // 验证码
    captcha: {
      npm: {
        disabled: false,
        id: 'tms-koa-account',
        module: 'models/captcha',
        checker: 'checkCaptcha',
        generator: 'createCaptcha',
      },
    },
  },
}

module.exports = appConfig

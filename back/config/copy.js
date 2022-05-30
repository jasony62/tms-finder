let appConfig = {
  name: process.env.TMS_KOA_NAME || 'tms-finder', // 如需自定义可在项目根目录下创建/back/.env文件配置成环境变量
  port: process.env.TMS_KOA_PORT || 3000, // 如需自定义可在项目根目录下创建/back/.env文件配置成环境变量
  https: {
    disabled: !!process.env.TMS_KOA_HTTPS,
    port: parseInt(process.env.TMS_KOA_HTTPS_PORT),
    key: process.env.TMS_APP_HTTPS_SSL_KEY,
    cert: process.env.TMS_APP_HTTPS_SSL_CERT,
  },
  router: {
    auth: {
      prefix: '', // 鉴权接口调用url的前缀
    },
    controllers: {
      prefix: '', // 接口调用url的前缀
    },
    fsdomain: {
      prefix: 'fs', // 文件下载服务的前缀
    },
  },
  // 鉴权 jwt
  auth: {
    jwt: {
      privateKey: 'tms-finder-secret',
      expiresIn: 3600,
    },
    // 验证码
    captcha: {
      // 如需自定义验证码，可在项目根目录下创建生成验证码文件，将文件路径命名给path并注释code
      // path: "files"
      code: '1234',
    },
    //
    client: {
      // 如需自定义鉴权函数，可在项目根目录下创建鉴权函数, 将文件路径命名给path并注释 accounts
      // path: "files"
      accounts: [
        // 默认用户组
        {
          id: 1,
          username: 'root',
          password: 'root',
        },
      ],
    },
  },
}

module.exports = appConfig

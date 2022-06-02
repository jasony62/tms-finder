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
      prefix: 'auth', // 鉴权接口调用url的前缀
      plugins_npm: [{ id: 'tms-koa-account', alias: 'account' }], // 账号管理相关接口
    },
    controllers: {
      prefix: 'api', // 接口调用url的前缀
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
    // 鉴权 redis  如果鉴权信息要从redis中获取，可在此连接redis需注释上面jwt对象，redis中端口、地址等信息可在项目根目录下创建/back/.env文件配置成环境变量，并且需要在/back/config/文件夹中依据redis.sample.js创建redis.js
    // redis: {
    //   prefix: process.env.TMS_REDIS_PREFIX || "tms-mongodb-web",
    //   host: process.env.TMS_REDIS_HOST || "localhost",
    //   port: parseInt(process.env.TMS_REDIS_PORT) || 6379,
    //   password: process.env.TMS_REDIS_PWD || '',
    //   expiresIn: parseInt(process.env.TMS_REDIS_EXPIRESIN) || 7200
    // },
    // 验证码
    captcha: {
      // 如需自定义验证码，可在项目根目录下创建生成验证码文件，将文件路径命名给path并注释code
      // path: '/auth/captcha.js', // 指定验证码实现方法
      // checkPath: '/auth/checkPath.js' // 指定检查验证码方法
      // code: '1234', // 指定固定验证码
      npm: {
        disabled: false,
        id: 'tms-koa-account',
        module: 'models/captcha',
        checker: 'checkCaptcha',
        generator: 'createCaptcha',
      },
    },
    /* 检查bucket参数，支持多租户访问 */
    bucket: { validator: './config/bucket.js' },
  },
}

module.exports = appConfig

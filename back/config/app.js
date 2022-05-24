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
        generator: "createCaptcha"
      },
    },
    //
    client: {
      // 如需自定义鉴权函数，可在项目根目录下创建鉴权函数, 将文件路径命名给path并注释 accounts
      // path: '/auth/client.js', // 指定用户认证实现方法
      // registerPath: "/auth/register.js" // 指定用户注册的实现方法
      // accounts: [ // 默认用户组
      //   {
      //     id: 1,
      //     username: 'root',
      //     password: 'root',
      //   },
      // ],
      npm: {
        disabled: false,
        id: 'tms-koa-account',
        authentication: 'models/authenticate',
        register: 'models/register',
      },
    },
  },
}

module.exports = appConfig
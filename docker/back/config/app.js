const { env } = process
const appConfig = {
  name: env.TFD_APP_NAME || 'tms-finder',
  port: env.TFD_APP_PORT || 3000,
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
      npm: {
        disabled: /true|yes/i.test(env.TFD_APP_AUTH_CLIENT_DISABLED),
        id: 'tms-koa-account/dist/models',
        authentication: 'authenticate.js',
        register: 'register.js',
        logout: 'logout.js',
      },
      path: env.TFD_APP_AUTH_CLIENT_PATH || '',
      logoutPath: env.TFD_APP_AUTH_CLIENT_LOGOUT_PATH || '',
    },
    // 保存鉴权信息
    jwt: {
      privateKey:
        env.TFD_APP_AUTH_JWT_KEY ||
        `TFD${Date.now()}${parseInt(Math.random() * 100)}`,
      expiresIn: parseInt(env.TFD_APP_AUTH_JWT_EXPIRESIN) || 3600,
    },
    // 验证码
    captcha: {
      npm: {
        disabled: /true|yes/i.test(env.TFD_APP_AUTH_CAPTCHA_DISABLED),
        id: 'tms-koa-captcha',
        module: 'dist/index.js',
        checker: 'checkCaptcha',
        generator: 'createCaptcha',
      },
    },
  },
}

export default appConfig

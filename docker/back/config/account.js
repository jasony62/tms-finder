const { env } = process

export default {
  disabled: /true|yes/i.test(env.TFD_APP_AUTH_CLIENT_DISABLED),
  admin: { username: 'admin', password: 'admin' },
  mongodb: {
    disabled: false,
    name: env.TFD_APP_AUTH_CLIENT_MONGODB_NAME || 'master',
    database: env.TFD_APP_AUTH_CLIENT_MONGODB_DATABASE || 'tfd_account',
    collection: env.TFD_APP_AUTH_CLIENT_MONGODB_COLLECTION || 'account',
  },
  authConfig: {
    pwdErrMaxNum: 5, // int 密码错误次数限制 0 不限制
    authLockDUR: 20, // int 登录锁定时长 （秒）
    pwdStrengthCheck: {
      min: 8, // 密码最小长度
      max: 20, // 密码最大长度
      pwdBlack: ['P@ssw0rd'], // 密码黑名单
      containProjects: {
        mustCheckNum: 3,
        contains: ['digits', 'uppercase', 'lowercase', 'symbols'],
      }, // 是否包含数字、大写字母、小写字母、特殊字符, 至少满足其中length项
      hasSpaces: false, // 是否包含空格
      hasAccount: false,
      hasKeyBoardContinuousChar: false,
      // hasKeyBoardContinuousCharSize: 4
    },
  },
}

module.exports = {
  port: 3000,
  name: "dev-op",
  router: {
    auth: {
      prefix: "/finder/ue" // 接口调用url的前缀
    },
    controllers: {
      prefix: "/finder/api" // 接口调用url的前缀
    }
  },
  tmsTransaction: false,
  auth: {
    jwt: {
      privateKey: "dev-finder",
      expiresIn: 1800
    },
    // redis: {
    //   // host: "192.168.20.247",
    //   prefix: "dev-op",
    //   host: "localhost",
    //   port: 6378
    // },
    captcha: {
      // path: "/auth/captcha.js",
      code: "aabb"
    },
    client: {
      // path: "/auth/client.js",
      accounts: [
        {
          id: 1,
          username: "aaaa",
          password: "aaaa"
        },
        {
          id: 2,
          username: "bbbb",
          password: "bbbb"
        },
        {
          id: 3,
          username: "lzw1",
          password: "aaaa"
        },
        {
          id: 4,
          username: "lzw2",
          password: "aaaa"
        },
        {
          id: 5,
          username: "lzw3",
          password: "aaaa"
        }
      ]
    }
  }
}
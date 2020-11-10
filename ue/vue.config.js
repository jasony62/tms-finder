const VUE_APP_BASE_URL = process.env.VUE_APP_BASE_URL ? process.env.VUE_APP_BASE_URL : ''

const isSupportSSL = /yes|true/i.test(process.env.VUE_APP_WEB_SERVER_SSL)

const configs = {
  publicPath: `${VUE_APP_BASE_URL}/web`,
  outputDir: `dist${VUE_APP_BASE_URL}/web`,
}

/* 本地启用时，是否使用https端口 */
if (parseInt(process.env.VUE_APP_WEB_SERVER_HTTPS_PORT) > 0) {
  configs.devServer = { https: true, port: parseInt(process.env.VUE_APP_WEB_SERVER_HTTPS_PORT) }
}

module.exports = configs

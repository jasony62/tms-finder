const VUE_APP_BASE_URL = process.env.VUE_APP_BASE_URL ? process.env.VUE_APP_BASE_URL : ''

module.exports = {
  publicPath: `${VUE_APP_BASE_URL}/web`,
  outputDir: `dist${VUE_APP_BASE_URL}/web`,
  devServer: {
    proxy: {
      // proxy: target
      "/finder/auth": {
        target: process.env.VUE_APP_API_HOST,
      },
      "/finder/api": {
        target: process.env.VUE_APP_API_HOST,
      },
      "/finder/fs": {
        target: process.env.VUE_APP_API_HOST,
      },
    }
  }
}

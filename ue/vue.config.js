const VUE_APP_BASE_URL = process.env.VUE_APP_BASE_URL ? process.env.VUE_APP_BASE_URL : ''

module.exports = {
  publicPath: `${VUE_APP_BASE_URL}/web`,
  outputDir: `dist${VUE_APP_BASE_URL}/web`
}

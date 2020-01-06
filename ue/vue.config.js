const devServer = { proxy: {} }

// 代理auth请求
devServer.proxy[`${process.env.VUE_APP_BACK_AUTH_BASE}/auth`] = { target: process.env.VUE_APP_BACK_AUTH_SERVER }
// 代理api请求
devServer.proxy[`${process.env.VUE_APP_BACK_API_BASE}/file`] = { target: process.env.VUE_APP_BACK_API_SERVER }

module.exports = {
  publicPath: './',
  outputDir: 'dist',
  filenameHashing: true,
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: './index.html',
      title: 'tms-finder',
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    }
  },
  devServer,
  parallel: require('os').cpus().length > 1,
  runtimeCompiler: true
}

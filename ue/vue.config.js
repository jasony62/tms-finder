module.exports = {
  publicPath: '/ue/',
  outputDir: '../back/public/ue',
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
  parallel: require('os').cpus().length > 1,
  runtimeCompiler: true
}

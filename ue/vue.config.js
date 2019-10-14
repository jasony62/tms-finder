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
  // enabled by default if the machine has more than 1 cores
  parallel: require('os').cpus().length > 1,
  // 是否使用包含运行时编译器的 Vue 构建版本。
  runtimeCompiler: true
}

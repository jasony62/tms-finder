// const target = 'http://192.168.102.110:3000';
const target = 'http://192.168.43.14:3000';
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
  devServer: {
    proxy: {
      "/api": {
        target: target,
        changeOrigin: true, // 是否改变域名
        // ws: true
        // pathRewrite: {
        //   // 路径重写
        //   "/api": "" 
        // }
      }
    },
  },
  parallel: require('os').cpus().length > 1,
  runtimeCompiler: true
}

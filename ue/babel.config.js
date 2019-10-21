module.exports = {
  presets: [['@vue/app']],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    [
      'import',
      {
        libraryName: 'tms-vue-ui',
        style: true
      },
      'tms-vue-ui'
    ],
    [
      'import',
      {
        libraryName: 'vant',
        libraryDirectory: 'lib',
        style: true
      },
      'vant'
    ]
  ]
}

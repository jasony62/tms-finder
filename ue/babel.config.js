module.exports = {
  presets: [['@vue/app']],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk',
      },
    ],
    [
      'import',
      {
        libraryName: 'vant',
        libraryDirectory: 'es',
        style: true,
      },
      'vant',
    ],
    [
      'import',
      {
        libraryName: 'tms-vue-ui',
        style: true,
      },
      'tms-vue-ui',
    ],
  ],
}

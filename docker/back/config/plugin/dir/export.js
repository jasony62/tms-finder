const {
  TFD_PLUGIN_DIR_EXPORT_DISABLED: Disabled,
  TFD_PLUGIN_WIDGET_URL_HOST,
  TFD_PLUGIN_DIR_EXPORT_NAME: Name,
  TFD_PLUGIN_DIR_EXPORT_BUCKETLIKE: BucketLike,
  TFD_PLUGIN_DIR_EXPORT_DIRLIKE: DirLike,
  TFD_PLUGIN_DIR_EXPORT_FILELIKE: FileLike,
  TFD_PLUGIN_DIR_EXPORT_TITLE: Title,
  TFD_PLUGIN_DIR_EXPORT_WIDGET_URL,
  TFD_PLUGIN_DIR_EXPORT_SOURCE_DIR,
  TFD_PLUGIN_DIR_EXPORT_OUTPUT_DIR,
  TFD_PLUGIN_DIR_EXPORT_DOWNALOD_BASE_URL,
} = process.env

// 插件前端页面地址
const widgetUrl = TFD_PLUGIN_DIR_EXPORT_WIDGET_URL
  ? TFD_PLUGIN_DIR_EXPORT_WIDGET_URL
  : TFD_PLUGIN_WIDGET_URL_HOST
  ? TFD_PLUGIN_WIDGET_URL_HOST + '/plugin/dir-export'
  : '/plugin/dir-export'

export default {
  disabled: /true|yes/i.test(Disabled),
  widgetUrl,
  name: Name ? Name : 'dir-export',
  title: Title ? Title : '导出目录',
  bucketLike: BucketLike,
  dirLike: DirLike,
  fileLike: FileLike,
  sourceDir: TFD_PLUGIN_DIR_EXPORT_SOURCE_DIR,
  outputDir: TFD_PLUGIN_DIR_EXPORT_OUTPUT_DIR,
  downloadBaseURL: TFD_PLUGIN_DIR_EXPORT_DOWNALOD_BASE_URL,
}

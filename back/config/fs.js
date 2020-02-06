module.exports = {
  local: {
    rootDir: process.env.TMS_FINDER_FS_ROOTDIR || 'storage',
    database: {
      dialect: 'mongodb',
      source: process.env.TMS_FINDER_FS_MONGODB_SOURCE || 'master',
      database: process.env.TMS_FINDER_FS_MONGODB_DATABASE || 'upload',
      file_collection: process.env.TMS_FINDER_FS_MONGODB_COLLECTION || 'files'
    },
    schemas: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      type: 'object',
      title: 'Json-Doc-File',
      description: 'tms-vue-finder file',
      properties: {
        comment: {
          type: 'string',
          minLength: 0,
          maxLength: 80,
          title: '说明',
          attrs: {
            placeholder: '请输入说明',
            title: '说明'
          }
        }
      }
    }
  }
}

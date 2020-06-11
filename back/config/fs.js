const database = {
  dialect: 'mongodb',
  source: process.env.TMS_FINDER_FS_MONGODB_SOURCE || 'master',
  database: process.env.TMS_FINDER_FS_MONGODB_DATABASE || 'upload',
  file_collection: process.env.TMS_FINDER_FS_MONGODB_COLLECTION || 'files',
}

module.exports = {
  local: {
    rootDir: process.env.TMS_FINDER_FS_ROOTDIR || 'storage',
    thumbnail: {
      dir: '_thumbs',
      width: 100,
      height: 100,
    },
    domains: {
      upload: {
        database,
        customName: process.env.TMS_FINDER_FS_CUSTOMNAME || true,
      },
      download: { database, customName: process.env.TMS_FINDER_FS_CUSTOMNAME || true },
    },
    defaultDomain: 'upload',
  },
}

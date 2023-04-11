const { env } = process

const database = {
  dialect: 'mongodb',
  source: env.TFD_FS_MONGODB_SOURCE || 'master',
  database: env.TFD_FS_MONGODB_DATABASE || 'tfd_fs',
  file_collection: env.TFD_FS_MONGODB_COLLECTION || 'files',
}

module.exports = {
  local: {
    disabled: /true|yes/i.test(env.TFD_FS_LOCAL_DISABLED),
    rootDir: env.TFD_FS_ROOTDIR || 'storage',
    thumbnail: {
      disabled: /true|yes/i.test(env.TFD_FS_THUMBNAIL_DISABLED),
      dir: '_thumbs',
      width: 100,
      height: 100,
    },
    domains: {
      upload: {
        database,
        customName: env.TFD_FS_CUSTOMNAME || true,
      },
      download: { database, customName: env.TFD_FS_CUSTOMNAME || true },
    },
    defaultDomain: 'upload',
  },
  minio: {
    enabled: /true|yes/i.test(env.TFD_FS_MINIO_ENABLED),
    endPoint: env.TFD_FS_MINIO_END_POINT || '127.0.0.1',
    port: env.TFD_FS_MINIO_END_PORT || 9000,
    useSSL: /true|yes/i.test(env.TFD_FS_MINIO_USE_SSL),
    accessKey: env.TFD_FS_MINIO_ACCESS_KEY,
    secretKey: env.TFD_FS_MINIO_SECRET_KEY,
    domains: {
      [env.TFD_FS_MINIO_BUCKET || 'upload']: {
        database,
        customName: env.TFD_FS_CUSTOMNAME || true,
      },
    },
    defaultDomain: env.TFD_FS_MINIO_BUCKET || 'upload',
  },
}

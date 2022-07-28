const appConfig = {
  master: {
    host: process.env.TFD_MONGODB_HOST || 'host.docker.internal',
    port: parseInt(process.env.TFD_MONGODB_PORT) || 27017,
    user: process.env.TFD_MONGODB_USER || 'root',
    password: process.env.TFD_MONGODB_PASSWORD || 'root',
  },
}

module.exports = appConfig

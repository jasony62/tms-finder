module.exports = {
  master: {
    host: process.env.TMS_FINDER_MONGODB_HOST,
    port: parseInt(process.env.TMS_FINDER_MONGODB_PORT),
    user: process.env.TMS_FINDER_MONGODB_USER || false,
    password: process.env.TMS_FINDER_MONGODB_PASSWORD || false,
  },
}

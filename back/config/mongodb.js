module.exports = {
  master: {
    host: process.env.TMS_FINDER_MONGODB_HOST,
    port: parseInt(process.env.TMS_FINDER_MONGODB_PORT)
  }
}
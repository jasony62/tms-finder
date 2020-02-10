let host
if (process.env.TMS_MONGODB_WEB_ENV === 'docker') {
  host = 'docker.for.mac.host.internal'
} else {
  host = 'localhost'
}
module.exports = {
  host,
  port: 27017
}

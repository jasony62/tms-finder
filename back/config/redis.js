module.exports = {
  disabled: false, // 可省略
  prefix: process.env.TMS_REDIS_PREFIX || 'tms-mongodb-web',
  host: process.env.TMS_REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.TMS_REDIS_PORT) || 6379,
  expiresIn: parseInt(process.env.TMS_REDIS_EXPIRESIN) || 7200
}
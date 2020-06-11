module.exports = {
  appenders: {
    out: { type: 'stdout' },
  },
  categories: {
    default: { appenders: ['out'], level: process.env.TMS_APP_LOG4JS_LEVEL || 'debug' },
  },
  pm2: true,
}

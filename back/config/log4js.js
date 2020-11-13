module.exports = {
  appenders: {
    out: { type: 'stdout' },
  },
  categories: {
    default: { appenders: ['out'], level: process.env.TMS_KOA_LOG4JS_LEVEL || 'debug' },
  },
  pm2: true,
}

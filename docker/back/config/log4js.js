module.exports = {
  appenders: {
    consoleout: { type: 'console' },
    fileout: {
      type: 'file',
      filename: './logs/tfd-logs.log',
      maxLogSize: 1024 * 1024,
    },
  },
  categories: {
    default: {
      appenders: ['consoleout', 'fileout'],
      level: process.env.TFD_APP_LOG4JS_LEVEL || 'info',
    },
  },
}

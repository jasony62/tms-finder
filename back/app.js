const log4jsConfig = require('./config/log4js')
const log4js = require('log4js')
log4js.configure(log4jsConfig)
const logger = log4js.getLogger()

process.on('uncatchException', function(e) {
  logger.error('未处理异常', e)
  // eslint-disable-next-line no-process-exit
  process.exit(0)
})

const { TmsKoa } = require('tms-koa')

const tmsKoa = new TmsKoa()

tmsKoa.startup()

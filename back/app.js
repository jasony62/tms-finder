const log4jsConfig = require('./config/log4js')
const log4js = require('log4js')
log4js.configure(log4jsConfig)
const logger = log4js.getLogger()

require('dotenv').config() // 环境变量 默认读取项目根目录下的.env文件

process.on('uncatchException', function (e) {
  logger.error('未处理异常', e)
  // eslint-disable-next-line no-process-exit
  process.exit(0)
})

const { TmsKoa } = require('tms-koa')

const tmsKoa = new TmsKoa()
if (process.env.TMS_FINDER_PROXY === "true") tmsKoa.proxy = true

tmsKoa.startup()

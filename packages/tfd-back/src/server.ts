import log4js from 'log4js'
import path from 'path'
import fs from 'fs'

let cnfpath = path.resolve(process.cwd() + '/config/log4js.js')
if (fs.existsSync(cnfpath)) {
  const { default: log4jsConfig } = await import(cnfpath)
  log4js.configure(log4jsConfig)
} else {
  log4js.configure({
    appenders: {
      consoleout: { type: 'console' },
    },
    categories: {
      default: {
        appenders: ['consoleout'],
        level: process.env.TFD_APP_LOG4JS_LEVEL || 'debug',
      },
    },
  })
}
const logger = log4js.getLogger('tms-finder')

process.on('uncatchException', function (e) {
  logger.error('未处理异常', e)
  // eslint-disable-next-line no-process-exit
  process.exit(0)
})

import { TmsKoa } from 'tms-koa'
const tmsKoa = new TmsKoa()

/**
 * 框架完成初始化
 */
function afterInit() {
  logger.info('已完成框架初始化')
}

tmsKoa.startup({ afterInit })

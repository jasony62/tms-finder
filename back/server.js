const log4jsConfig = require('./config/log4js')
const log4js = require('log4js')
log4js.configure(log4jsConfig)
const logger = log4js.getLogger()
const PluginContext = require('./models/plugin/context').Context

process.on('uncatchException', function (e) {
  logger.error('未处理异常', e)
  // eslint-disable-next-line no-process-exit
  process.exit(0)
})

const { TmsKoa, loadConfig } = require('tms-koa')

const tmsKoa = new TmsKoa()

function loadPlugins() {
  let config = loadConfig('plugin')
  PluginContext.init(config)
}
/**
 * 框架完成初始化
 *
 * @param {object} context
 */
function afterInit(context) {
  logger.info('已完成框架初始化')
  /**
   * 加载插件
   */
  loadPlugins(context)
}

tmsKoa.startup({ afterInit })

const _ = require('lodash')
const { ResultFault, ResultData } = require('tms-koa')
const { BaseCtrl } = require('tms-koa/lib/controller/fs/base')
const PluginHelper = require('./pluginHelper')
const PluginContext = require('../../models/plugin/context').Context

/** 插件控制器类 */
class Plugin extends BaseCtrl {
  constructor(...args) {
    super(...args)
    this.pluginHelper = new PluginHelper(this)
  }
  
  async execute(ctx) {
    this.query = ctx.query
    let { plugin: pluginName } = ctx.query

    if (!pluginName) return new ResultFault('缺少plugin参数')

    const ins = await PluginContext.ins()

    const plugin = ins.byName(pluginName)
    if (!plugin) return new ResultFault(`未找到指定插件[plugin=${pluginName}]`)

    if (plugin.scope) {
      let arg
      switch (plugin.scope) {
        case 'collection':
          arg = await this.pluginHelper.findRequestDb()
          break
        case 'document':
          arg = await this.pluginHelper.findRequestCl()
          break
      }
      const result = await plugin.execute(this, arg)
      return new ResultData(result)
    }

    return new ResultData('ok')
  }
}

module.exports = Plugin

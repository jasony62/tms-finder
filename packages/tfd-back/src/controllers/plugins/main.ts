import { Ctrl, ResultFault, ResultData } from 'tms-koa'
import { PluginContext } from 'tfd-kit'
import { PluginProfile } from 'tfd-data'

/**
 * 插件控制器类
 */
class Plugin extends Ctrl {
  constructor(ctx, client, dbContext, mongoClient, pushContext, fsContext?) {
    super(ctx, client, dbContext, mongoClient, pushContext, fsContext)
  }
  /**
   * @swagger
   *
   * /api/plugins/list:
   *   get:
   *     tags:
   *       - plugin
   *     summary: 获取用于处理document对象的插件列表
   *     parameters:
   *       - $ref: '#/components/parameters/bucket'
   *       - $ref: '#/components/parameters/dbName'
   *       - $ref: '#/components/parameters/clName'
   *       - name: scope
   *         description: 插件适用对象
   *         in: query
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       '200':
   *         description: result为插件数组
   *         content:
   *           application/json:
   *             schema:
   *               "$ref": "#/components/schemas/ResponseDataArray"
   */
  async list() {
    const { scope, dir, file } = this.request.query
    if (!['dir', 'file'].includes(scope))
      return new ResultFault(`参数错误[scope=${scope}]`)

    const ins = await PluginContext.ins()

    // 适用于指定管理对象类型的所有插件
    let plugins: PluginProfile[] =
      scope === 'dir' ? ins.dirPlugins : scope === 'file' ? ins.filePlugins : []

    /**进行筛选*/
    plugins = plugins.filter((plugin) => {
      let { bucketLike, dirLike, fileLike } = plugin

      if (bucketLike && bucketLike instanceof RegExp && this.bucketObj?.name) {
        if (bucketLike.test(this.bucketObj?.name) === false) return false
      }

      if (dirLike && dirLike instanceof RegExp)
        if (dirLike.test(dir) === false) return false

      if (fileLike && fileLike instanceof RegExp) {
        if (fileLike.test(file) === false) return false
      }

      return true
    })

    return new ResultData(plugins)
  }
  /**
   * @swagger
   *
   * /api/plugins/remoteWidgetOptions:
   *   post:
   *     tags:
   *       - plugin
   *     summary: 获取插件的前置条件
   *     parameters:
   *       - $ref: '#/components/parameters/bucket'
   *       - $ref: '#/components/parameters/dbName'
   *       - $ref: '#/components/parameters/clName'
   *       - name: plugin
   *         in: query
   *         description: 插件名称
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               filter:
   *                 description: 什么逻辑？
   *                 type: string
   *     responses:
   *       '200':
   *         description: result为前置条件对象
   *         content:
   *           application/json:
   *             schema:
   *               "$ref": "#/components/schemas/ResponseData"
   */
  async remoteWidgetOptions() {
    let { bucket, dir, file, plugin: pluginName } = this.request.query

    if (!pluginName) return new ResultFault('缺少plugin参数')

    const ins = await PluginContext.ins()

    const plugin = ins.byName(pluginName)
    if (!plugin) return new ResultFault(`未找到指定插件[plugin=${pluginName}]`)

    if (typeof plugin.remoteWidgetOptions !== 'function')
      return new ResultFault(
        `插件[plugin=${plugin.name}]没有定义[remoteWidgetOptions]方法`
      )

    const condition = await plugin.remoteWidgetOptions(
      bucket,
      dir,
      file,
      this.request.body
    )

    return new ResultData(condition)
  }
  /**
   * @swagger
   *
   * /api/plugins/execute:
   *   post:
   *     tags:
   *       - plugin
   *     summary: 执行指定的插件
   *     parameters:
   *       - $ref: '#/components/parameters/bucket'
   *       - $ref: '#/components/parameters/dbName'
   *       - $ref: '#/components/parameters/clName'
   *       - name: plugin
   *         in: query
   *         description: 插件名称
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               docIds:
   *                 description: 文档id数组
   *                 type: array
   *               filter:
   *                 description: 筛选条件
   *                 type: object
   *               related:
   *                 description: 选择的相关文档
   *                 type: object
   *                 properties:
   *                   docIds:
   *                     description: 文档id数组
   *                     type: array
   *           examples:
   *             basic:
   *               summary: 基本示例
   *               value: {"docIds": [], "filter": {}, "related": {"docIds": []}}
   *     responses:
   *       '200':
   *         description: result为插件执行情况的说明
   *         content:
   *           application/json:
   *             schema:
   *               "$ref": "#/components/schemas/ResponseData"
   *             examples:
   *               documents:
   *                 summary: 文档对象
   *                 value: {"type":"documents", "inserted":[{"_id":""}], "modified":[{"_id":""}], "removed":[""]}
   *               numbers:
   *                 summary: 文档数量
   *                 value: {"type":"numbers", "nInserted":0, "nModified":0, "nRemoved":0}
   *               message:
   *                 summary: 文本消息
   *                 value: "执行完毕"
   */
  async execute() {
    let { plugin: pluginName } = this.request.query

    if (!pluginName) return new ResultFault('缺少plugin参数')

    const ins = await PluginContext.ins()

    const plugin = ins.byName(pluginName)
    if (!plugin) return new ResultFault(`未找到指定插件[plugin=${pluginName}]`)

    if (plugin.scope) {
      const { code, msg } = await plugin.execute(this)
      if (code !== 0) return new ResultFault(msg)
      return new ResultData(msg)
    }

    return new ResultData('ok')
  }
}

export default Plugin

//@ts-nocheck
import {
  PluginProfileScope,
  PluginProfileAmount,
  PluginExecuteResult,
} from 'tfd-data'
import { loadConfig, PluginBase } from 'tfd-kit'
import path from 'path'
import Debug from 'debug'

const debug = Debug('tfd:plugins:dir:export')

/**配置文件存放位置*/
const ConfigDir = path.resolve(
  process.env.TMS_KOA_CONFIG_DIR || process.cwd() + '/config'
)

// 插件配置文件地址
const ConfigFile =
  process.env.TMW_PLUGIN_DOC_EXPORT_CONFIG_NAME || './plugin/dir/export'

/**
 * 将集合中的文档数据导出为json或者excel文件
 */
class ExportPlugin extends PluginBase {
  constructor(file: string) {
    super(file)
    this.name = 'dir-export'
    this.title = '导出目录'
    this.description = '将目录中的文件打包压缩。'
    this.scope = PluginProfileScope.dir
    this.amount = PluginProfileAmount.one
    this.beforeWidget = { name: 'external', url: '', size: '60%' }
  }
  /**
   * 执行插件
   * @param ctrl
   * @returns
   */
  async execute(ctrl: any): Promise<PluginExecuteResult> {
    const { bucket, dir } = ctrl.request.query
    debug(`执行插件，操作对象[bucket=${bucket ?? ''}, dir=${dir}]`)
    return { code: 0, msg: { data: 'hello' } }
  }
}

export async function createPlugin(file: string) {
  let config
  if (ConfigFile) config = await loadConfig(ConfigDir, ConfigFile)
  if (!config || typeof config !== 'object') {
    console.warn(
      `[plugin:dir:export] 没有从[${path.resolve(
        ConfigDir,
        ConfigFile
      )}]获得插件配置数据`
    )
    return false
  }
  let { widgetUrl, bucketLike, dirLike, fileLike, title, disabled } = config
  const newPlugin = new ExportPlugin(file)
  newPlugin.beforeWidget.url = widgetUrl

  if (bucketLike) newPlugin.bucketLike = new RegExp(bucketLike)
  if (dirLike) newPlugin.dirLike = new RegExp(dirLike)
  if (fileLike) newPlugin.fileLike = new RegExp(fileLike)

  if (title && typeof title === 'string') newPlugin.title = title

  if (disabled) newPlugin.disabled = disabled

  return newPlugin
}

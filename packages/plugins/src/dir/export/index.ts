import {
  PluginProfileScope,
  PluginProfileAmount,
  PluginExecuteResult,
} from 'tfd-data'
import { loadConfig, PluginBase } from 'tfd-kit'
import Debug from 'debug'
import path from 'path'
import fs from 'fs'
import archiver from 'archiver'

const debug = Debug('tfd:plugins:dir:export')

/**配置文件存放位置*/
const ConfigDir = path.resolve(
  process.env.TMS_KOA_CONFIG_DIR || process.cwd() + '/config'
)

// 插件配置文件地址
const ConfigFile =
  process.env.TMW_PLUGIN_DOC_EXPORT_CONFIG_NAME || './plugin/dir/export'

/**
 *
 * @param source
 * @param destination
 * @returns
 */
function zipOutput(source: string, destination: string) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(destination)

    const archive = archiver('zip', { zlib: { level: 9 } })

    // listen for all archive data to be written
    // 'close' event is fired only when a file descriptor is involved
    output.on('close', () => {
      debug(
        'archiver has been finalized and the output file descriptor has closed.'
      )
      // 获得文件基本信息
      const { size, birthtime, birthtimeMs, mtime, mtimeMs } =
        fs.statSync(destination)
      resolve({ result: { size, birthtime, birthtimeMs, mtime, mtimeMs } })
    })

    // This event is fired when the data source is drained no matter what was the data source.
    // It is not part of this library but rather from the NodeJS Stream API.
    // @see: https://nodejs.org/api/stream.html#stream_event_end
    output.on('end', () => {
      debug('Data has been drained')
      resolve({})
    })

    // good practice to catch warnings (ie stat failures and other non-blocking errors)
    archive.on('warning', (err) => {
      if (err.code === 'ENOENT') {
        // log warning
      } else {
        // throw error
        reject(err)
      }
    })

    // good practice to catch this error explicitly
    archive.on('error', (err) => {
      reject(err)
    })

    // pipe archive data to the file
    archive.pipe(output)

    // append files from a sub-directory, putting its contents at the root of archive
    archive.directory(source, false)

    // finalize the archive (ie we are done appending files but streams have to finish yet)
    // 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
    archive.finalize()
  })
}

/**
 * 将集合中的文档数据导出为json或者excel文件
 */
class ExportPlugin extends PluginBase {
  /**
   * 文件获取目录
   */
  sourceDir: string
  /**
   * 文件输出目录
   */
  outputDir: string
  /**
   * 文件下载地址
   */
  downloadBaseURL: string

  constructor(file: string) {
    super(file)
    this.name = 'dir-export'
    this.title = '导出目录'
    this.description = '将目录中的文件打包压缩。'
    this.scope = PluginProfileScope.dir
    this.amount = PluginProfileAmount.one
    this.beforeWidget = { name: 'external', url: '', size: '40%' }
  }
  /**
   * 执行插件
   *
   * @param ctrl
   * @returns
   */
  async execute(ctrl: any): Promise<PluginExecuteResult> {
    const { bucket, dir } = ctrl.request.query
    debug(`执行插件，操作对象[bucket=${bucket ?? ''}, dir=${dir}]`)

    const source = path.resolve(this.sourceDir, bucket, dir.replace('/', ''))
    debug('指定了目录路径：%s', source)

    // dir是从反斜杠开始，命名时去掉开头的
    const outputName =
      (bucket ? `${bucket}_` : '') +
      `${dir.replace('/', '').replaceAll('/', '_')}.zip`
    const destination = path.resolve(this.outputDir, outputName)
    debug('指定了输出路径：%s', destination)

    await zipOutput(source, destination)

    const downloadURL = `${this.downloadBaseURL}/${outputName}`

    return { code: 0, msg: { name: outputName, url: downloadURL } }
  }
}

export async function createPlugin(file: string) {
  let config
  if (ConfigFile) config = await loadConfig(ConfigDir, ConfigFile)
  if (!config || typeof config !== 'object') {
    console.warn(
      `[tfd:plugin:dir:export] 没有从[${path.resolve(
        ConfigDir,
        ConfigFile
      )}]获得插件配置数据`
    )
    return false
  }
  let {
    widgetUrl,
    bucketLike,
    dirLike,
    fileLike,
    title,
    disabled,
    sourceDir,
    outputDir,
    downloadBaseURL,
  } = config
  if (!sourceDir || typeof sourceDir !== 'string') {
    console.warn(`[tfd:plugin:dir:export] 没有指定[sourceDir]参数`)
    return false
  }
  if (!fs.existsSync(sourceDir)) {
    console.warn(`[tfd:plugin:dir:export] 参数[sourceDir]的路径不存在`)
    return false
  }
  if (!fs.statSync(sourceDir).isDirectory()) {
    console.warn(`[tfd:plugin:dir:export] 参数[sourceDir]的路径不是目录`)
    return false
  }
  if (!outputDir || typeof outputDir !== 'string') {
    console.warn(`[tfd:plugin:dir:export] 没有指定[outputDir]参数`)
    return false
  }
  if (!fs.existsSync(outputDir)) {
    console.warn(`[tfd:plugin:dir:export] 参数[outputDir]的路径不存在`)
    return false
  }
  if (!fs.statSync(outputDir).isDirectory()) {
    console.warn(`[tfd:plugin:dir:export] 参数[outputDir]的路径不是目录`)
    return false
  }

  const newPlugin = new ExportPlugin(file)
  newPlugin.beforeWidget.url = widgetUrl
  newPlugin.sourceDir = sourceDir
  newPlugin.outputDir = outputDir
  newPlugin.downloadBaseURL = downloadBaseURL

  if (bucketLike) newPlugin.bucketLike = new RegExp(bucketLike)
  if (dirLike) newPlugin.dirLike = new RegExp(dirLike)
  if (fileLike) newPlugin.fileLike = new RegExp(fileLike)

  if (title && typeof title === 'string') newPlugin.title = title

  if (disabled) newPlugin.disabled = disabled

  return newPlugin
}

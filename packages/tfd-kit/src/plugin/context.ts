import log4js from '@log4js-node/log4js-api'
import path from 'path'
import { glob } from 'glob'

import { PluginBase } from './base.js'
import { PluginProfile } from 'tfd-data'

const logger = log4js.getLogger('tms-mongodb-web')

const PluginsByName = new Map<string, PluginBase>() // 插件名称到插件示例

const DirProfiles: PluginProfile[] = [] // 目录插件简要描述
const FileProfiles: PluginProfile[] = [] // 文件插件简要描述

/**
 * 检查插件信息是否设置正确
 *
 * @param {PluginBase} plugin
 */
function validatePlugin(plugin: PluginBase) {
  return plugin
    .validate()
    .then(() => {
      return true
    })
    .catch((reason) => {
      logger.warn(reason)
      return false
    })
}

export class Context {
  get dirPlugins() {
    return DirProfiles
  }

  get filePlugins() {
    return FileProfiles
  }

  byName(name) {
    return PluginsByName.get(name)
  }

  static init = (function () {
    let _instance
    return async function (pluginConfig?): Promise<Context> {
      if (_instance) return _instance

      if (!pluginConfig?.dir) {
        _instance = new Context()
        return _instance
      }

      let { dir } = pluginConfig
      const dirAry = dir.split(',')
      logger.info(`读取插件配置[${dirAry}]`)
      dirAry.forEach(async (dir) => {
        dir = dir.trim()
        if (dir === '') return
        let absDir = path.resolve(process.cwd(), dir)
        let files: string[] = glob.sync(`${absDir}/*.js`)
        logger.info(`从目录[${absDir}]读取插件文件，数量[${files.length}]`)
        for (let file of files) {
          if (file.indexOf('node_modules') !== -1) continue
          try {
            let { createPlugin } = await import(file)
            if (typeof createPlugin !== 'function') {
              logger.warn(
                `插件文件[${path.basename(
                  file
                )}]不可用，没有导出[createPlugin]方法`
              )
              continue
            }

            // 支持用1个插件文件创建多个插件实例
            let plugin: PluginProfile | boolean = await createPlugin(file)
            if (false === plugin) {
              logger.warn(`插件文件[${file}]创建插件失败`)
              continue
            }

            let plugins = Array.isArray(plugin) ? plugin : [plugin]
            for (let onePlugin of plugins) {
              // if (!onePlugin || !(onePlugin instanceof PluginBase)) {
              //   logger.warn(`插件文件[${file}]不是[PluginBase]类型，不可用`)
              //   logger.debug(`插件文件[${file}]`, onePlugin)
              //   continue
              // }
              if (onePlugin.disabled === true) {
                logger.warn(`插件文件[${onePlugin.file}]已禁用`)
                continue
              }
              let passed = await validatePlugin(onePlugin)
              if (passed) {
                if (PluginsByName.has(onePlugin.name)) {
                  logger.warn(
                    `插件文件[${onePlugin.file}]不可用，已有同名插件[name=${onePlugin.name}]`
                  )
                  continue
                }
                let { name, scope } = onePlugin
                switch (scope) {
                  case 'dir':
                    DirProfiles.push(onePlugin.profile)
                    break
                  case 'file':
                    FileProfiles.push(onePlugin.profile)
                    break
                }
                PluginsByName.set(name, onePlugin)

                logger.info(`从文件[${file}]创建插件[name=${name}]`)
              }
            }
          } catch (e) {
            logger.error(`从文件[${file}]创建插件发生异常`, e)
          }
        }
      })

      _instance = new Context()

      return _instance
    }
  })()

  static ins = Context.init
}

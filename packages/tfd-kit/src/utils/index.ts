import fs from 'fs'
import path from 'path'
import _ from 'lodash'

/*
 * 加载配置文件
 *
 * @param {string} name - 配置名称
 * @param {object} defaultConfig - 默认配置
 *
 * @return {object} 配置数据对象
 */
export async function loadConfig(configDir, name, defaultConfig?) {
  let basepath = path.resolve(configDir, `${name}.js`)
  let baseConfig
  if (fs.existsSync(basepath)) {
    baseConfig = (await import(basepath)).default
  } else {
  }
  let localpath = path.resolve(configDir, `${name}.local.js`)
  let localConfig
  if (fs.existsSync(localpath)) {
    localConfig = (await import(localpath)).default
  }
  if (defaultConfig || baseConfig || localConfig) {
    return _.merge({}, defaultConfig, baseConfig, localConfig)
  }

  return false
}

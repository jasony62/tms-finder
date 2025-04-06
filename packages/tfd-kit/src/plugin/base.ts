import {
  PluginProfile,
  PluginProfileScope,
  PluginProfileAmount,
  PluginProfileBeforeWidget,
  PluginExecuteResult,
} from 'tfd-data'

// 必须提供的属性
const RequiredProps = ['name', 'scope', 'title', 'description']

/**
 * 插件基类
 */
export abstract class PluginBase {
  file: string // 插件配置文件名称
  name: string // 插件名
  scope: PluginProfileScope // 适用管理对象，支持：database，collection，document
  title: string // 插件按钮名称
  description: string // 插件描述信息
  bucketLike?: RegExp // 和存储空间名称匹配的正则表达式
  dirLike?: RegExp // 和目录名称匹配的正则表达式
  fileLike?: RegExp // 和文件名称匹配的正则表达式
  amount?: PluginProfileAmount // 处理的数据量，zero,single,many
  visible?: boolean // 控制适用的文档条件，当文档的key的值和指定值一致时显示
  disabled?: boolean
  beforeWidget?: PluginProfileBeforeWidget
  remoteWidgetOptions?: Function
  dirBlacklist?: RegExp // 黑名单，和目录名称匹配的正则表达式
  fileBlacklist?: RegExp // 黑名单，和文件名称匹配的正则表达式

  /**
   * 创建插件
   * @param {string} file - 文件名
   */
  constructor(file: string) {
    if (typeof file !== 'string') throw '创建插件时未指定有效参数[file]'
    this.file = file
  }
  /**
   * 检查插件合规性，是否包含了必须的属性和方法
   */
  validate() {
    let pRequiredProps = RequiredProps.map((prop) => {
      return new Promise((resolve, reject) => {
        if (typeof this[prop] !== 'string' || !this[prop]) {
          reject(`插件文件[${this.file}]不可以，属性[${prop}]为空`)
        } else {
          resolve(true)
        }
      })
    })
    return Promise.all(pRequiredProps).then(() => {
      let { file, scope, execute } = this
      if (!['dir', 'file'].includes(scope))
        throw `插件文件[${file}]不可用，插件属性[scope=${scope}]无效`

      if (!execute || typeof execute !== 'function')
        throw `插件文件[${file}]不可用，创建的插件未包含[execute]方法`

      return true
    })
  }
  /**
   * 执行插件操作
   * @param ctrl
   */
  abstract execute(ctrl: any): Promise<PluginExecuteResult>
  /**
   * 返回参见描述信息
   *
   * @returns {object} 插件的描述信息
   */
  get profile(): PluginProfile {
    const {
      name,
      scope,
      title,
      description,
      bucketLike,
      dirLike,
      fileLike,
      beforeWidget,
      amount,
      disabled,
      visible,
      dirBlacklist,
      fileBlacklist,
    } = this

    return {
      name,
      scope,
      title,
      description,
      bucketLike,
      dirLike,
      fileLike,
      beforeWidget,
      amount,
      disabled,
      visible,
      dirBlacklist,
      fileBlacklist,
    }
  }
}

/**
 * 插件适用范围
 */
export enum PluginProfileScope {
  dir = 'dir',
  file = 'file',
}
/**
 * 插件激活条件
 */
export enum PluginProfileAmount {
  zero = 'zero',
  one = 'one',
  many = 'many',
}
/**
 * 插件前端组件
 */
export interface PluginProfileBeforeWidget {
  /**
   * 前端内置插件名称
   * 当值为external时，为外置自定义部件
   */
  name: string
  /**
   * 内置区间是否需要远程参数
   */
  remoteWidgetOptions?: boolean
  /**
   * 自定义部件的打开地址
   */
  url?: string
  /**
   * 自定义部分显示宽度
   */
  size?: string
  /**
   * 携带的其它信息
   */
  [k: string]: any
}
/**
 * 插件定义
 */
export interface PluginProfile {
  /**
   * 插件名称
   */
  name: string
  /**
   * 适用管理对象
   * database/collection/document
   */
  scope: PluginProfileScope
  /**
   * 插件操作显示名称
   */
  title: string
  /**
   * 插件描述信息
   */
  description: string
  /**
   * 是否已禁用
   */
  disabled?: boolean
  /**
   * 是否显示插件
   */
  visible?: any
  /**
   * 需要的数据
   * zero,one,many
   */
  amount?: PluginProfileAmount
  /**
   * 和存储空间名称匹配的正则表达式
   */
  bucketLike?: RegExp
  /**
   * 和目录名称匹配的正则表达式
   */
  dirLike?: RegExp
  /**
   * 和文件名称匹配的正则表达式
   */
  fileLike?: RegExp
  /**
   * 调用前执行的前端插件，用于输入条件。
   */
  beforeWidget?: PluginProfileBeforeWidget
  /**
   * 内置部件参数
   */
  remoteWidgetOptions?: Function
  /**
   * 目录黑名单
   * 和目录名称匹配的正则表达式
   */
  dirBlacklist?: RegExp
  /**
   * 文件黑名单
   * 和文件名称匹配的正则表达式
   */
  fileBlacklist?: RegExp
  /**
   * 指定其它过滤条件
   *
   * @param args
   * @returns
   */
  match?: (obj: any) => {}
}
/**
 * 插件执行结果
 */
export interface PluginExecuteResult {
  code: number
  msg: any
}

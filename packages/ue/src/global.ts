type Globalsettings = {
  loginIgnored: boolean
  authApiBase: string
  authApiPort: number
  backApiBase: string
  backApiPort: number
  backFsBase: string
  backFsPort: number
  loginCaptchaDisabled: boolean
  externalLoginUrl: string // 第三方登录
  supportThumbnail: boolean
  supportPickFile: boolean
  supportMultiView: boolean
  bucketMode: boolean // 空间隔离模式
  pickFileFiledNameMapping: { [domain: string]: object }
  uploadFileAccept: '' // 逗号分隔的上传文件类型列表
}

let _globalsettings: Globalsettings = {
  loginIgnored: /yes|true/i.test(import.meta.env.VITE_LOGIN_IGNORED),
  authApiBase: import.meta.env.VITE_AUTH_API_BASE || 'auth',
  authApiPort: parseInt(import.meta.env.VITE_AUTH_API_PORT ?? location.port),
  backApiBase: import.meta.env.VITE_BACK_API_BASE || 'api',
  backApiPort: parseInt(import.meta.env.VITE_BACK_API_PORT ?? location.port),
  backFsBase: import.meta.env.VITE_BACK_FS_BASE || '',
  backFsPort: parseInt(import.meta.env.VITE_BACK_FS_PORT ?? location.port),
  loginCaptchaDisabled: /yes|true/i.test(
    import.meta.env.VITE_LOGIN_CAPTCHA_DISABLED
  ),
  externalLoginUrl: import.meta.env.VITE_EXTERNAL_LOGIN_URL,
  supportThumbnail: false,
  supportPickFile: false,
  supportMultiView: /yes|true/i.test(import.meta.env.VITE_SUPPORT_MULTI_VIEW),
  bucketMode: /yes|true/i.test(import.meta.env.VITE_BUCKET_MODE),
  pickFileFiledNameMapping: {},
  uploadFileAccept:
    import.meta.env.VITE_UPLOAD_FILE_ACCEPT ??
    '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,image/*,audio/*,video/*,.csv,.json,.jsonl,.md,.yml,.yaml',
}
/**
 * 根据在线获取的全局设置
 * @param settings
 */
export function init(settings: Globalsettings) {
  if (settings.loginIgnored)
    _globalsettings.loginIgnored = settings.loginIgnored
  if (settings.authApiBase) _globalsettings.authApiBase = settings.authApiBase
  if (settings.authApiPort) _globalsettings.authApiPort = settings.authApiPort
  if (settings.backApiBase) _globalsettings.backApiBase = settings.backApiBase
  if (settings.backApiPort) _globalsettings.backApiPort = settings.backApiPort
  if (settings.backFsBase) _globalsettings.backFsBase = settings.backFsBase
  if (settings.backFsPort) _globalsettings.backFsPort = settings.backFsPort
  if (settings.loginCaptchaDisabled)
    _globalsettings.loginCaptchaDisabled = settings.loginCaptchaDisabled
  if (settings.externalLoginUrl)
    _globalsettings.externalLoginUrl = settings.externalLoginUrl
  if (settings.supportPickFile)
    _globalsettings.supportPickFile = settings.supportPickFile
  if (settings.supportThumbnail)
    _globalsettings.supportThumbnail = settings.supportThumbnail
  if (settings.supportMultiView)
    _globalsettings.supportMultiView = settings.supportMultiView
  if (settings.bucketMode) _globalsettings.bucketMode = settings.bucketMode
  if (
    settings.pickFileFiledNameMapping &&
    typeof settings.pickFileFiledNameMapping === 'object'
  )
    _globalsettings.pickFileFiledNameMapping = settings.pickFileFiledNameMapping

  _globalsettings.supportPickFile = /yes|true/i.test(
    getQueryVariable('pickFile')
  )
  if (settings.uploadFileAccept)
    _globalsettings.uploadFileAccept = settings.uploadFileAccept
}
/**
 * 根据环境变量设置是否关闭认证
 */
export const LOGIN_IGNORED = () => _globalsettings.loginIgnored
/**
 * 文件列表页面是否显示【选取】操作
 */
export const SUPPORT_PICK_FILE = () => _globalsettings.supportPickFile
/**
 * 是否支持多视图
 */
export const SUPPORT_THUMBNAIL = () => _globalsettings.supportThumbnail
/**
 * 是否支持多视图
 */
export const SUPPORT_MULTI_VIEW = () => _globalsettings.supportMultiView
/**
 * 空间模式
 */
export const BUCKET_MODE = () => _globalsettings.bucketMode
/**
 * 关闭验证码
 */
export const LOGIN_CAPTCHA_DISABLED = () => _globalsettings.loginCaptchaDisabled
/**
 * 外部登录地址
 */
export const EXTERNAL_LOGIN_URL = () => _globalsettings.externalLoginUrl
/**
 * 上传文件类型限制
 */
export const UPLOAD_FILE_ACCEPT = () => _globalsettings.uploadFileAccept
/**
 * 返回存储域返回的文件字段名映射关系
 * @param domain 指定的存储域名称。存储域名称为空时，返回以'$'命名的默认映射。
 * @returns 字段映射关系
 */
export const PICK_FILE_FILED_NAME_MAPPING = (domain: string) =>
  _globalsettings.pickFileFiledNameMapping[domain ? domain : '$'] ?? {}
/**
 * 根据环境变量设置认证服务起始地址
 */
let _AUTH_API_URL: string
export const AUTH_API_URL = () => {
  if (_AUTH_API_URL) return _AUTH_API_URL

  let base = _globalsettings.authApiBase
  if (/^http/.test(base)) {
    _AUTH_API_URL = base
  } else {
    let url
    let { protocol, hostname } = location
    url = `${protocol}//${hostname}`

    let port = _globalsettings.authApiPort
    if (port && port !== 80 && port !== 443) url += `:${port}`

    if (base) url += '/' + base.replace(/^\/*/, '')

    _AUTH_API_URL = url
  }

  return _AUTH_API_URL
}

/**
 * 根据环境变量设置后端服务起始地址
 */
let _BACK_API_URL: string
export const BACK_API_URL = () => {
  if (_BACK_API_URL) return _BACK_API_URL

  let base = _globalsettings.backApiBase
  if (/^http/.test(base)) {
    _BACK_API_URL = base
  } else {
    let url
    let { protocol, hostname } = location
    url = `${protocol}//${hostname}`

    let port = _globalsettings.backApiPort
    if (port && port !== 80 && port !== 443) url += `:${port}`

    if (base) url += '/' + base.replace(/^\/*/, '')

    _BACK_API_URL = url
  }

  return _BACK_API_URL
}
/**
 * 根据环境变量设置后端文件服务起始地址
 */
let _BACK_FS_URL: string
export const BACK_FS_URL = () => {
  if (_BACK_FS_URL) return _BACK_FS_URL

  let base = _globalsettings.backFsBase
  if (/^http/.test(base)) {
    _BACK_FS_URL = base
  } else {
    let url
    let { protocol, hostname } = location
    url = `${protocol}//${hostname}`

    let port = _globalsettings.backFsPort
    if (port && port !== 80 && port !== 443) url += `:${port}`

    if (base) url += '/' + base.replace(/^\/*/, '')

    _BACK_FS_URL = url
  }

  // 保证以反斜杠结尾
  if (!/\/$/.test(_BACK_FS_URL)) _BACK_FS_URL += '/'

  return _BACK_FS_URL
}
/**
 * 获得指定查询参数的值
 * @param variable
 * @returns
 */
export function getQueryVariable(variable: string) {
  var query = window.location.search.substring(1)
  var vars = query.split('&')
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=')
    if (pair[0] == variable) {
      return pair[1]
    }
  }
  return ''
}

const way = import.meta.env.VITE_APP_STORETOKEN_WAY

function getCookie(cname: string) {
  let name = cname + '='
  let ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim()
    if (c.indexOf(name) == 0) return c.substring(name.length, c.length)
  }
  return ''
}

export function setLocalToken(token: string) {
  if (way === 'session') {
    sessionStorage.setItem('access_token', token)
  } else {
    let host = window.location.hostname
    document.cookie = `access_token=${token};path=/;domain=${host}`
  }
}
/**
 * 返回保存在本地的token信息
 * @returns
 */
export function getLocalToken(): string | null {
  if (way === 'session') {
    return sessionStorage.getItem('access_token')
  } else {
    return getCookie('access_token')
  }
}
/**
 * 清除保存在本地的token信息
 */
export function removeLocalToken() {
  if (way === 'session') {
    sessionStorage.removeItem('access_token')
  }
}
/**
 * 跳转到外部登录页
 *
 * 1. 提供回调地址。回调地址处理好token
 */
export function externalLogin() {
  let appurl = location.toString()
  if (/login/.test(appurl)) {
    // 跳转到应用首页
    appurl = appurl.replace(/login.*/, '')
  }
  // 保存要返回应用页
  sessionStorage.setItem('oauth_passed_appurl', appurl)

  const url = EXTERNAL_LOGIN_URL()
  location.href = url
}

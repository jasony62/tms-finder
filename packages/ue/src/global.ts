type Globalsettings = {
  authDisabled: boolean
  authApiBase: string
  authApiPort: number
  backApiBase: string
  backApiPort: number
  backFsBase: string
  backFsPort: number
  supportPickFile: boolean
  supportSetInfo: boolean
  supportMultiView: boolean
}

let _globalsettings: Globalsettings = {
  authDisabled: /yes|true/i.test(import.meta.env.VITE_AUTH_DISABLED),
  authApiBase: import.meta.env.VITE_AUTH_API_BASE || 'auth',
  authApiPort: parseInt(import.meta.env.VITE_AUTH_API_PORT ?? location.port),
  backApiBase: import.meta.env.VITE_BACK_API_BASE || 'api',
  backApiPort: parseInt(import.meta.env.VITE_BACK_API_PORT ?? location.port),
  backFsBase: import.meta.env.VITE_BACK_FS_BASE || 'fs',
  backFsPort: parseInt(import.meta.env.VITE_BACK_FS_PORT ?? location.port),
  supportPickFile: /yes|true/i.test(import.meta.env.VITE_SUPPORT_PICK_FILE),
  supportSetInfo: /yes|true/i.test(import.meta.env.VITE_SUPPORT_SET_INFO),
  supportMultiView: /yes|true/i.test(import.meta.env.VITE_SUPPORT_MULTI_VIEW),
}
/**
 * 根据在线获取的全局设置
 * @param settings
 */
export function init(settings: Globalsettings) {
  if (settings.authDisabled) _globalsettings.authDisabled = settings.authDisabled
  if (settings.authApiBase) _globalsettings.authApiBase = settings.authApiBase
  if (settings.authApiPort) _globalsettings.authApiPort = settings.authApiPort
  if (settings.backApiBase) _globalsettings.backApiBase = settings.backApiBase
  if (settings.backApiPort) _globalsettings.backApiPort = settings.backApiPort
  if (settings.backFsBase) _globalsettings.backFsBase = settings.backFsBase
  if (settings.backFsPort) _globalsettings.backFsPort = settings.backFsPort
  if (settings.supportPickFile) _globalsettings.supportPickFile = settings.supportPickFile
  if (settings.supportSetInfo) _globalsettings.supportSetInfo = settings.supportSetInfo
  if (settings.supportMultiView) _globalsettings.supportMultiView = settings.supportMultiView
}
/**
 * 根据环境变量设置是否关闭认证
 */
export const AUTH_DISABLED = () => _globalsettings.authDisabled
/**
 * 文件列表页面是否显示【选取】操作
 */
export const SUPPORT_PICK_FILE = () => _globalsettings.supportPickFile
/**
 * 文件列表页面是否显示【编辑】操作
 */
export const SUPPORT_SET_INFO = () => _globalsettings.supportSetInfo
/**
 * 是否支持多视图
 */
export const SUPPORT_MULTI_VIEW = () => _globalsettings.supportMultiView
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

  return _BACK_FS_URL
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

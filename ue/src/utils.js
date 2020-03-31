export default {
  // 返回文件的完整url
  getFileUrl(file) {
    const fserver = process.env.VUE_APP_FS_SERVER || `${location.protocol}//${location.host}:${location.port}`
    const fileurl = `${fserver}${file.path}`

    return fileurl
  },
  postMessage(callback) {
    let target = window.parent ? window.parent : window.opener ? window.opener : false
    if (target) {
      const data = typeof callback === 'function' ? callback() : callback
      if (data) {
        target.postMessage(data, '*')
      }
    }
  }
}

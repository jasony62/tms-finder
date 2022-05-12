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

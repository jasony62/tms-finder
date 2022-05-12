import { TmsAxios } from 'tms-vue3'
import Crypto from 'crypto'
const baseAuth = (import.meta.env.VITE_AUTH_SERVER || '') + '/auth'
//const baseAuth = (import.meta.env.VITE_APP_BACK_AUTH_BASE || '') + '/auth'
const userKey = import.meta.env.VITE_APP_LOGIN_KEY_USERNAME || 'username'
const pwdKey = import.meta.env.VITE_APP_LOGIN_KEY_PASSWORD || 'password'
/**
 * 加密
 * @param {*} password
 * @returns
 */
function aesEncrypt(param: string, time: number) {
  const key = time + 'adc'
  const cipher = Crypto.createCipheriv('aes-128-cbc', key, key)
  let crypted = cipher.update(param, 'utf8', 'hex')
  crypted += cipher.final('hex')

  return crypted
}

export default {
  /**
   * 获取验证码
   *
   * @returns
   */
  fnCaptcha() {
    const userId: string = String(new Date().getTime())
    sessionStorage.setItem('captcha_code', userId)
    //const data = { userId: userId, appId: import.meta.env.VITE_APP_LOGIN_CODE_APPID || 'tms-finder' }
    return TmsAxios.ins('auth-api')
      .get(`${baseAuth}/captcha?width=150&height=44&userId=${userId}&appId=${import.meta.env.VITE_APP_LOGIN_CODE_APPID || 'tms-finder'}`)
      .then((rst: any) => {
        const data = {
          code: rst.data.code,
          captcha: rst.data.result,
        }
        return Promise.resolve(data)
      })
  },
  /**
   * 获取token
   *
   * @returns
   */
  fnLogin(userArg: any) {
    let userId
    if (sessionStorage.getItem('captcha_code')) {
      userId = sessionStorage.getItem('captcha_code')
    }
    console.log('userId', userId)
    const appId = import.meta.env.VITE_APP_LOGIN_CODE_APPID || 'tms-web'
    let params = { ...userArg }
    let url = `${baseAuth}/authenticate`
    if (import.meta.env.VITE_APP_AUTH_SECRET === 'yes') {
      const time = Date.now()
      url += '?adc=' + time
      params[userKey] = aesEncrypt(params[userKey], time)
      params[pwdKey] = aesEncrypt(params[pwdKey], time)
    }
    const data = {
      password: params['password'],
      pin: params['pin'],
      username: params['uname'],
      userId: userId,
      appId: appId
    }
    return TmsAxios.ins('auth-api')
      .post(url, data)
      .then((rst: any) => { return Promise.resolve(rst.data) })
  },
}

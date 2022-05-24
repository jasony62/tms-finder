import { TmsAxios } from 'tms-vue3'

//import { aesEncrypt } from '../global'
const baseAuth = (import.meta.env.VITE_BACK_AUTH_BASE || '') + '/auth'
const userKey = import.meta.env.VITE_APP_LOGIN_KEY_USERNAME || 'username'
const pwdKey = import.meta.env.VITE_APP_LOGIN_KEY_PASSWORD || 'password'

export default {
  /**
   * 获取验证码
   *
   * @returns
   */
   fnCaptcha() {
    const userId: string = String(new Date().getTime())
    sessionStorage.setItem('captcha_code', userId)
    return TmsAxios.ins('auth-api')
      .get(`${baseAuth}/captcha?captchaid=${userId}&appid=${import.meta.env.VITE_APP_LOGIN_CODE_APPID || 'tms-web'}&background=fff`)
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
    const appId = import.meta.env.VITE_APP_LOGIN_CODE_APPID || 'tms-web'
    let params = { ...userArg }
    let url = `${baseAuth}/authenticate`
    // if (import.meta.env.VITE_APP_AUTH_SECRET === 'yes') {
    //   const time = Date.now()
    //   url += '?adc=' + time
    //   params[userKey] = aesEncrypt(params[userKey], time)
    //   params[pwdKey] = aesEncrypt(params[pwdKey], time)
    // }
    const data = {
      password: params['password'],
      code: params['pin'],
      username: params['uname'],
      captchaid: userId,
      appid: appId
    }
    return TmsAxios.ins('auth-api')
      .post(url, data)
      .then((rst: any) => { return Promise.resolve(rst.data) })
  },
}

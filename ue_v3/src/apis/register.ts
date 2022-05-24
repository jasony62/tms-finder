import { TmsAxios } from 'tms-vue3'
//import { aesEncrypt } from '../global'
const baseAuth = (import.meta.env.VITE_BACK_AUTH_BASE || '') + '/auth'
const userKey = import.meta.env.VITE_APP_LOGIN_KEY_USERNAME || 'username'
const pwdKey = import.meta.env.VITE_APP_LOGIN_KEY_PASSWORD || 'password'

export default {
  /**
   * 注册
   *
   * @returns
   */
   fnRegister(userArg: any) {
    let userId
    if (sessionStorage.getItem('captcha_code')) {
      userId = sessionStorage.getItem('captcha_code')
    }
    const appId = import.meta.env.VITE_APP_LOGIN_CODE_APPID || 'tms-web'
    let params = { ...userArg }
    let url = `${baseAuth}/register`
    // if (import.meta.env.VITE_APP_AUTH_SECRET === 'yes') {
    //   params[userKey] = aesEncrypt(params[userKey])
    //   params[pwdKey] = aesEncrypt(params[pwdKey])
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

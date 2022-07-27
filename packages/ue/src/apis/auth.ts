import { TmsAxios } from 'tms-vue3'
//@ts-ignore
import { encodeAccountV1 } from 'tms-koa-account/models/crypto'
const baseAuth = (import.meta.env.VITE_BACK_AUTH_BASE || '') + '/auth'

const APPID = import.meta.env.VITE_LOGIN_CODE_APPID || 'tms-mongodb-web'

const ISCRYPTO = import.meta.env.VITE_ENCRYPT_SECRET || 'no'

let captchaId: string

function genCaptchaId() {
  let rand = Math.floor(Math.random() * 1000 + 1)
  let id = Date.now() * 1000 + rand
  return `${id}`
}

export default {
  /**
   * 获取验证码
   *
   * @returns
   */
  fnCaptcha() {
    captchaId = genCaptchaId()
    const url = `${baseAuth}/captcha?appid=${APPID}&captchaid=${captchaId}&background=fff`
    return TmsAxios.ins('auth-api')
      .get(url)
      .then((rst: any) => {
        const data = {
          code: rst.data.code,
          captcha: rst.data.result,
        }
        return Promise.resolve(data)
      })
  },
  /**
   * 注册
   *
   * @returns
   */
  fnRegister(userArg: any) {
    let params = { ...userArg }
    let url = `${baseAuth}/register`
    if (ISCRYPTO === 'yes') {
      const encode = encodeAccountV1({
        username: params['uname'],
        password: params['password'],
      })
      params['uname'] = encode[1]['username']
      params['password'] = encode[1]['password']
    }
    const data = {
      password: params['password'],
      code: params['pin'],
      username: params['uname'],
      captchaid: captchaId,
      appid: APPID,
    }
    return TmsAxios.ins('auth-api')
      .post(url, data)
      .then((rst: any) => {
        return Promise.resolve(rst.data)
      })
  },
  /**
   * 登录
   *
   * @returns
   */
  fnLogin(userArg: any) {
    let params = { ...userArg }
    let url = `${baseAuth}/authenticate`
    if (ISCRYPTO === 'yes') {
      const encode = encodeAccountV1({
        username: params['uname'],
        password: params['password'],
      })
      params['uname'] = encode[1]['username']
      params['password'] = encode[1]['password']
    }
    const data = {
      password: params['password'],
      code: params['pin'],
      username: params['uname'],
      captchaid: captchaId,
      appid: APPID,
    }
    return TmsAxios.ins('auth-api')
      .post(url, data)
      .then((rst: any) => {
        return Promise.resolve(rst.data)
      })
  },
}

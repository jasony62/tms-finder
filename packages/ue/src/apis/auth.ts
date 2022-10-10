import { TmsAxios } from 'tms-vue3'
import { encodeAccountV1 } from 'tms-koa-crypto'
import { AUTH_API_URL } from '@/global'

const APPID = import.meta.env.VITE_LOGIN_CODE_APPID || 'tms-finder'

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
    const baseAuth = AUTH_API_URL()
    captchaId = genCaptchaId()
    const url = `${baseAuth}/captcha?appid=${APPID}&captchaid=${captchaId}`
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
    const baseAuth = AUTH_API_URL()
    let params = { ...userArg }
    let url = `${baseAuth}/register`
    if (ISCRYPTO === 'yes') {
      const encode = encodeAccountV1({
        username: params['uname'],
        password: params['password'],
      })
      //@ts-ignore
      params['uname'] = encode[1]['username']
      //@ts-ignore
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
    const baseAuth = AUTH_API_URL()
    let params = { ...userArg }
    let url = `${baseAuth}/authenticate`
    if (ISCRYPTO === 'yes') {
      const encode = encodeAccountV1({
        username: params['uname'],
        password: params['password'],
      })
      //@ts-ignore
      params['uname'] = encode[1]['username']
      //@ts-ignore
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

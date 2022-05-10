import { TmsAxios } from 'tms-vue3'

const base = (import.meta.env.VITE_AUTH_SERVER || '') + '/auth'

export default {
  fnGetCaptcha() {
    return TmsAxios.ins('auth-api')
      .post(`${base}/captcha`)
      .then((rst) => Promise.resolve(rst.data))
  },
  fnGetJwt(params) {
    return TmsAxios.ins('auth-api')
      .post(`${base}/authorize`, params)
      .then((rst) => {
        return Promise.resolve(rst.data)
      })
  },
}

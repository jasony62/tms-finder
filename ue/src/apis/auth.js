import { TmsAxios } from 'tms-vue'

const baseAuth = (process.env.VUE_APP_AUTH_SERVER || '') + '/auth'

export default {
  fnGetCaptcha() {
    return TmsAxios.ins('auth-api')
      .post(`${baseAuth}/captcha`)
      .then(rst => Promise.resolve(rst.data))
  },
  fnGetJwt(params) {
    return TmsAxios.ins('auth-api')
      .post(`${baseAuth}/authorize`, params)
      .then(rst => {
        return Promise.resolve(rst.data)
      })
  }
}

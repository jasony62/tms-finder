import { TmsAxios } from 'tms-vue'

const baseApi = (process.env.VUE_BACK_API_BASE || '') + '/file/browse'

const baseAuth = (process.env.VUE_BACK_AUTH_BASE || '') + '/auth'

export default {
  schemas() {
    return TmsAxios.ins('file-api')
      .get(`${baseApi}/schemas`)
      .then(rst => rst.data.result)
  },
  list(dirName = '') {
    return TmsAxios.ins('file-api')
      .get(`${baseApi}/list?dir=${dirName}`)
      .then(rst => {
        rst.data.result.files.forEach(f => {
          if (typeof f.info !== 'object') f.info = {}
        })
        return rst.data.result
      })
  },
  setInfo(path, info) {
    return TmsAxios.ins('file-api')
      .post(`${baseApi}/setInfo?path=${path}`, info)
      .then(rst => rst.data.result)
  },
  overallSearch(params) {
    return TmsAxios.ins('file-api')
      .post(`${baseApi}/listAll`, params)
      .then(rst => rst.data.result)
  },
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

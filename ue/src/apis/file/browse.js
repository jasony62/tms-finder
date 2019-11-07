import { TmsAxios } from 'tms-vue'

const base = '/finder/api/file/browse';
const baseUe = '/finder/ue/auth';

export default {
  schemas() {
    return TmsAxios.ins('file-api')
      .get(`${base}/schemas`)
      .then(rst => rst.data.result)
      .catch(err => Promise.reject(err))
  },
  list(dirName = '') {
    return TmsAxios.ins('file-api')
      .get(`${base}/list?dir=${dirName}`)
      .then(rst => {
        rst.data.result.files.forEach(f => {
          if (typeof f.info !== 'object') f.info = {}
        })
        return rst.data.result
      })
      .catch(err => Promise.reject(err))
  },
  setInfo(path, info) {
    return TmsAxios.ins('file-api')
      .post(`${base}/setInfo?path=${path}`, info)
      .then(rst => rst.data.result)
      .catch(err => Promise.reject(err))
  },
  overallSearch(params) {
    return TmsAxios.ins('file-api')
    .post(`${base}/listAll`, params)
    .then(rst => rst.data.result)
    .catch(err => Promise.reject(err))
  },
  fnGetCaptcha() {
    return TmsAxios.ins('file-api')
    .post(`${baseUe}/captcha`)
    .then(rst => Promise.resolve(rst.data))
    .catch(err => alert(err))
  },
  fnGetToken(params) {
    return TmsAxios.ins('file-api')
    .post(`${baseUe}/token`, params)
    .then(rst => Promise.resolve(rst.data))
    .catch(err => alert(err.msg))
  }
}

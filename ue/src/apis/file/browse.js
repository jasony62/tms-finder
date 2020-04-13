<<<<<<< HEAD
const baseApi = (process.env.VUE_APP_API_SERVER || '') + '/file/browse'

export default function create(tmsAxios) {
  return {
    schemas() {
      return tmsAxios.get(`${baseApi}/schemas`).then(rst => rst.data.result)
    },
    list(dirName = '', domain, bucket) {
      const params = { dir: dirName }
      if (domain !== undefined) params.domain = domain
      if (bucket !== undefined) params.bucket = bucket
      return tmsAxios.get(`${baseApi}/list`, { params }).then(rst => {
=======
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
>>>>>>> c70120cb6e54deb614ec8d8ecc02eb5b9e73c28c
        rst.data.result.files.forEach(f => {
          if (typeof f.info !== 'object') f.info = {}
        })
        return rst.data.result
      })
<<<<<<< HEAD
    },
    setInfo(path, info, domain, bucket) {
      const params = { path, domain, bucket }
      return tmsAxios.post(`${baseApi}/setInfo`, info, { params }).then(rst => rst.data.result)
    },
    overallSearch(params) {
      return tmsAxios.post(`${baseApi}/listAll`, params).then(rst => rst.data.result)
    }
=======
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
    .catch(err => Promise.resolve(err))
  },
  fnGetToken(params) {
    return TmsAxios.ins('file-api')
    .post(`${baseUe}/token`, params)
    .then(rst => Promise.resolve(rst.data))
    .catch(err => Promise.resolve(err))
>>>>>>> c70120cb6e54deb614ec8d8ecc02eb5b9e73c28c
  }
}

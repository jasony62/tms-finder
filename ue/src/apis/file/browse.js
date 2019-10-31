import Vue from 'vue'
import { TmsAxiosPlugin, TmsAxios } from 'tms-vue'
Vue.use(TmsAxiosPlugin)

let name = 'file-api'
Vue.TmsAxios({ name })

const base = '/api';

export default {
  schemas(access_token = '') {
    return TmsAxios.ins('file-api')
      .get(`${base}/file/browse/schemas?access_token=${access_token}`)
      .then(rst => rst.data.result)
      .catch(err => Promise.reject(err))
  },
  list(dirName = '') {
    return TmsAxios.ins('file-api')
      .get(`${base}/file/browse/list?dir=${dirName}`)
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
      .post(`${base}/file/browse/setInfo?path=${path}`, info)
      .then(rst => rst.data.result)
      .catch(err => Promise.reject(err))
  }
}

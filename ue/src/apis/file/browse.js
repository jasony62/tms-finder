import Vue from 'vue'
import { TmsAxiosPlugin, TmsAxios } from 'tms-vue'
Vue.use(TmsAxiosPlugin)

let name = 'file-api'
Vue.TmsAxios({ name })

export default {
  schemas() {
    return TmsAxios.ins('file-api')
      .get(`/file/browse/schemas`)
      .then(rst => rst.data.result)
      .catch(err => Promise.reject(err))
  },
  list(dirName = '') {
    return TmsAxios.ins('file-api')
      .get(`/file/browse/list?dir=${dirName}`)
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
      .post(`/file/browse/setInfo?path=${path}`, info)
      .then(rst => rst.data.result)
      .catch(err => Promise.reject(err))
  }
}

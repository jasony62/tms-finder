import Vue from 'vue'
import { TmsAxiosPlugin, TmsAxios } from 'tms-vue'
Vue.use(TmsAxiosPlugin)

let name = 'file-api'
Vue.TmsAxios({ name })

export default {
  list(dirName = '') {
    return TmsAxios.ins('file-api')
      .get(`/file/browse/list?dir=${dirName}`)
      .then(rst => rst.data.result)
      .catch(err => Promise.reject(err))
  }
}

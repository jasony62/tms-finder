import { TmsAxios } from 'tms-vue'

const baseApi = (process.env.VUE_BACK_API_BASE || '') + '/file/upload'

export default {
  plain(fileData, config) {
    return TmsAxios.ins('file-api')
      .post(`${baseApi}/plain`, fileData, config)
      .then(rst => rst.data.result)
  }
}

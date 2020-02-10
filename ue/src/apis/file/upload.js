const baseApi = (process.env.VUE_APP_API_SERVER || '') + '/file/upload'

export default function create(tmsAxios) {
  return {
    plain(fileData, config) {
      return tmsAxios.post(`${baseApi}/plain`, fileData, config).then(rst => rst.data.result)
    }
  }
}

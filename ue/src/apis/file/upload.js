const baseApi = (process.env.VUE_APP_API_SERVER || '') + '/file/upload'

export default function create(tmsAxios) {
  return {
    plain(query, fileData, config) {
      let url = `${baseApi}/plain`
      if (!config || typeof config !== 'object') config = {}
      const { dir, domain, bucket } = query
      config.params = { dir, domain, bucket }
      return tmsAxios.post(url, fileData, config).then(rst => rst.data.result)
    }
  }
}

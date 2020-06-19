const baseApi = (process.env.VUE_APP_API_SERVER || '') + '/file/upload'

export default function create(tmsAxios) {
  return {
    plain(query, fileData, config) {
      let url = `${baseApi}/plain`
      const params = { thumb: 'Y' }
      if (query) {
        if (query.domain !== undefined) params.domain = query.domain
        if (query.bucket !== undefined) params.bucket = query.bucket
        if (query.dir) params.dir = query.dir
      }
      if (config && typeof config === 'object') config.params = params
      else config = { params }

      return tmsAxios.post(url, fileData, config).then((rst) => rst.data.result)
    },
    mkdir(query) {
      const params = {}
      if (query) {
        if (query.domain !== undefined) params.domain = query.domain
        if (query.bucket !== undefined) params.bucket = query.bucket
        if (query.dir) params.dir = query.dir
      }
      let url = `${baseApi}/mkdir`

      return tmsAxios.get(url, { params }).then((rst) => rst.data.result)
    },
    rmdir(query) {
      const params = {}
      if (query) {
        if (query.domain !== undefined) params.domain = query.domain
        if (query.bucket !== undefined) params.bucket = query.bucket
        if (query.dir) params.dir = query.dir
      }
      let url = `${baseApi}/rmdir`

      return tmsAxios.get(url, { params }).then((rst) => rst.data.result)
    },
  }
}

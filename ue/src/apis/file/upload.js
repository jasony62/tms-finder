const baseApi = (process.env.VUE_APP_API_SERVER || '') + '/file/upload'

export default function create(tmsAxios) {
  return {
    plain(query, fileData, config) {
      let url = `${baseApi}/plain`
      if (query && query.dir) url += `?dir=${query.dir}`
      return tmsAxios.post(url, fileData, config).then(rst => rst.data.result)
    },
    mkdir(query) {
      const params = {}
      if (query.domain !== undefined) params.domain = query.domain
      if (query.bucket !== undefined) params.bucket = query.bucket
      let url = `${baseApi}/mkdir`
      if (query && query.dir) url += `?dir=${query.dir}`
      return tmsAxios.get(url, { params }).then(rst => rst.data.result)
    },
    rmdir(query) {
      const params = {}
      if (query.domain !== undefined) params.domain = query.domain
      if (query.bucket !== undefined) params.bucket = query.bucket
      let url = `${baseApi}/rmdir`
      if (query && query.dir) url += `?dir=${query.dir}`
      return tmsAxios.get(url, { params }).then(rst => rst.data.result)
    }
  }
}

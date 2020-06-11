const baseApi = (process.env.VUE_APP_API_SERVER || '') + '/file/browse'

export default function create(tmsAxios) {
  return {
    schemas(domain, bucket) {
      const params = { domain, bucket }
      return tmsAxios.get(`${baseApi}/schemas`, { params }).then((rst) => rst.data.result)
    },
    list(dirName = '', domain, bucket) {
      const params = { dir: dirName }
      if (domain !== undefined) params.domain = domain
      if (bucket !== undefined) params.bucket = bucket
      return tmsAxios.get(`${baseApi}/list`, { params }).then((rst) => {
        rst.data.result.files.forEach((f) => {
          if (typeof f.info !== 'object') f.info = {}
        })
        return rst.data.result
      })
    },
    setInfo(path, info, domain, bucket) {
      const params = { path, domain, bucket }
      return tmsAxios.post(`${baseApi}/setInfo`, info, { params }).then((rst) => rst.data.result)
    },
    overallSearch(params) {
      return tmsAxios.post(`${baseApi}/listAll`, params).then((rst) => rst.data.result)
    },
  }
}

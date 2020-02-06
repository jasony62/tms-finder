const baseApi = (process.env.VUE_APP_API_SERVER || '') + '/file/browse'

export default function create(tmsAxios) {
  return {
    schemas() {
      return tmsAxios.get(`${baseApi}/schemas`).then(rst => rst.data.result)
    },
    list(dirName = '') {
      return tmsAxios.get(`${baseApi}/list?dir=${dirName}`).then(rst => {
        rst.data.result.files.forEach(f => {
          if (typeof f.info !== 'object') f.info = {}
        })
        return rst.data.result
      })
    },
    setInfo(path, info) {
      return tmsAxios.post(`${baseApi}/setInfo?path=${path}`, info).then(rst => rst.data.result)
    },
    overallSearch(params) {
      return tmsAxios.post(`${baseApi}/listAll`, params).then(rst => rst.data.result)
    }
  }
}

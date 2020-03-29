const baseApi = (process.env.VUE_APP_API_SERVER || '') + '/file/manage'

export default function create(tmsAxios) {
  return {
    list(domain, bucket, batchArg) {
      const params = { batch: batchArg.toString(), domain, bucket }
      return tmsAxios.get(`${baseApi}/list`, { params }).then(rst => {
        return rst.data.result
      })
    }
  }
}

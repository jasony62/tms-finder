const baseApi = (process.env.VUE_APP_API_SERVER || '') + '/file/manage'

export default function create(tmsAxios) {
  return {
    list(batchArg) {
      return tmsAxios.get(`${baseApi}/list?batch=${batchArg}`).then(rst => {
        return rst.data.result
      })
    }
  }
}

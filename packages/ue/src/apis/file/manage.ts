import { TmsAxios } from 'tms-vue3'

const base = (import.meta.env.VITE_API_SERVER || '') + '/file/manage'

export default {
  list(domain: string, bucket: string, batchArg: any) {
    const params = { batch: batchArg.toString(), domain, bucket }
    return TmsAxios.ins('file-api')
      .get(`${base}/list`, { params })
      .then((rst: any) => {
        return rst.data.result
      })
  },
}

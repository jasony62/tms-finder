import { TmsAxios } from 'tms-vue3'
import { BACK_API_URL, SUPPORT_SET_INFO } from '@/global'

const base = () => BACK_API_URL() + '/file/browse'

export default {
  schemas(domain?: string, bucket?: string) {
    if (SUPPORT_SET_INFO()) {
      const params = { domain, bucket }
      return TmsAxios.ins('file-api')
        .get(`${base()}/schemas`, { params })
        .then((rst: any) => rst.data.result)
    } else {
      return Promise.resolve({})
    }
  },
  list(dirName = '', domain?: string, bucket?: string) {
    const params: { [k: string]: string } = { dir: dirName }
    if (domain !== undefined) params.domain = domain
    if (bucket !== undefined) params.bucket = bucket
    return TmsAxios.ins('file-api')
      .get(`${base()}/list`, { params })
      .then((rst: any) => {
        rst.data.result.files.forEach((f: any) => {
          if (typeof f.info !== 'object') f.info = {}
        })
        return rst.data.result
      })
  },
  setInfo(path: string, info: any, domain?: string, bucket?: string) {
    const params = { path, domain, bucket }
    return TmsAxios.ins('file-api')
      .post(`${base()}/setInfo`, info, { params })
      .then((rst: any) => rst.data.result)
  },
  overallSearch(params: any) {
    return TmsAxios.ins('file-api')
      .post(`${base()}/listAll`, params)
      .then((rst: any) => rst.data.result)
  },
}

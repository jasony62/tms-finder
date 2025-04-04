import { TmsAxios } from 'tms-vue3'
import { BACK_API_URL } from '@/global'
import facStore from '@/store'

const base = () => BACK_API_URL() + '/file/browse'

export default {
  /**
   *
   * @param domain
   * @param bucket
   * @returns
   */
  schemas(domain?: string, bucket?: string) {
    const params = { domain, bucket }
    return TmsAxios.ins('file-api')
      .get(`${base()}/schemas`, { params })
      .then((rst: any) => (rst.data.code === 0 ? rst.data.result : null))
  },
  /**
   *
   * @param dirName
   * @param domain
   * @param bucket
   * @returns
   */
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
  /**
   *
   * @param path
   * @param info
   * @param domain
   * @param bucket
   * @returns
   */
  setInfo(path: string, info: any, domain?: string, bucket?: string) {
    const params = { path, domain, bucket }
    const store = facStore()
    const { schemasRootName } = store
    const data = schemasRootName ? { [schemasRootName]: info } : info
    return TmsAxios.ins('file-api')
      .post(`${base()}/setInfo`, data, { params })
      .then((rst: any) => rst.data.result)
  },
  /**
   *
   * @param params
   * @returns
   */
  overallSearch(params: any) {
    return TmsAxios.ins('file-api')
      .post(`${base()}/listAll`, params)
      .then((rst: any) => rst.data.result)
  },
}

import { TmsAxios } from 'tms-vue3'
import { BACK_API_URL } from '@/global'
import { ApiRst } from './types.js'

export default {
  /**
   *
   * @param domain
   * @param bucket
   * @returns
   */
  schemas() {
    const base = BACK_API_URL() + '/bucket/admin/bucket'
    return TmsAxios.ins('file-api')
      .get(`${base}/schemas`)
      .then((rst: any) => (rst.data.code === 0 ? rst.data.result : null))
  },
  list() {
    const base = BACK_API_URL() + '/bucket/admin/bucket'
    return TmsAxios.ins('file-api')
      .get(`${base}/list`)
      .then((rst: ApiRst) => rst.data.result)
  },
  /**
   * 根据名称获得空间对象
   * @param bucketName
   */
  byName(bucketName: string) {
    const base = BACK_API_URL() + '/bucket/admin/bucket'
    return TmsAxios.ins('file-api')
      .get(`${base}/byName?bucket=${bucketName}`)
      .then((rst: ApiRst) => rst.data.result)
  },
  create(proto: any) {
    const base = BACK_API_URL() + '/bucket/admin/bucket'
    return TmsAxios.ins('file-api')
      .post(`${base}/create`, proto)
      .then((rst: ApiRst) => rst.data.result)
  },
  update(bucketName: any, updated: any) {
    const base = BACK_API_URL() + '/bucket/admin/bucket'
    return TmsAxios.ins('file-api')
      .post(`${base}/update?bucket=${bucketName}`, updated)
      .then((rst: ApiRst) => rst.data.result)
  },
  remove(bucket: { name: any }) {
    const base = BACK_API_URL() + '/bucket/admin/bucket'
    return TmsAxios.ins('file-api')
      .get(`${base}/remove?bucket=${bucket.name}`)
      .then((rst: ApiRst) => rst.data.result)
  },
  /**
   * 设置默认空间
   * @param bucketName
   */
  setDefault(bucketName: string) {
    const base = BACK_API_URL() + '/bucket/admin/bucket'
    return TmsAxios.ins('file-api')
      .get(`${base}/setdefault?bucket=${bucketName}`)
      .then((rst: ApiRst) => rst.data.result)
  },
}

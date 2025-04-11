import { TmsAxios } from 'tms-vue3'
import { BACK_API_URL } from '@/global'
import { ApiRst } from './types.js'

export default {
  invite(bucket: any, username: string) {
    const base = BACK_API_URL() + '/bucket/admin/coworker'
    const params = { username }
    return TmsAxios.ins('file-api')
      .post(`${base}/invite?bucket=${bucket}`, params)
      .then((rst: ApiRst) => rst.data.result)
  },
  list(bucket: any) {
    const base = BACK_API_URL() + '/bucket/admin/coworker'
    return TmsAxios.ins('file-api')
      .get(`${base}/list?bucket=${bucket}`)
      .then((rst: ApiRst) => rst.data.result)
  },
  remove(bucket: any, username: string) {
    const base = BACK_API_URL() + '/bucket/admin/coworker'
    return TmsAxios.ins('file-api')
      .get(`${base}/remove?bucket=${bucket}&username=${username}`)
      .then((rst: ApiRst) => rst.data.result)
  },
  accept(bucket: any, username: string, code: any) {
    const base = BACK_API_URL() + '/bucket/admin/coworker'
    return TmsAxios.ins('file-api')
      .get(`${base}/accept?bucket=${bucket}&code=${code}&username=${username}`)
      .then((rst: ApiRst) => rst.data.result)
  },
  reject(bucket: any, username: string, code: any) {
    const base = BACK_API_URL() + '/bucket/admin/coworker'
    return TmsAxios.ins('file-api')
      .get(`${base}/reject?bucket=${bucket}&code=${code}&username=${username}`)
      .then((rst: ApiRst) => rst.data.result)
  },
}

import { TmsAxios } from 'tms-vue3'
import { BACK_API_URL } from '@/global'
import { ApiRst } from './types.js'

export default {
  invite(bucket: any, nickname: string) {
    const base = BACK_API_URL() + '/bucket/admin/coworker'
    const params = { nickname }
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
  remove(bucket: any, nickname: string) {
    const base = BACK_API_URL() + '/bucket/admin/coworker'
    return TmsAxios.ins('file-api')
      .get(`${base}/remove?bucket=${bucket}&nickname=${nickname}`)
      .then((rst: ApiRst) => rst.data.result)
  },
  accept(bucket: any, nickname: string, code: any) {
    const base = BACK_API_URL() + '/bucket/admin/coworker'
    return TmsAxios.ins('file-api')
      .get(`${base}/accept?bucket=${bucket}&code=${code}&nickname=${nickname}`)
      .then((rst: ApiRst) => rst.data.result)
  },
}

import { TmsAxios } from 'tms-vue3'
import { BACK_API_URL } from '@/global'

const base = () => BACK_API_URL() + '/file/upload'

export default {
  plain(query: any, fileData: any, config: any) {
    let url = `${base()}/plain`
    const params: any = { thumb: 'Y' }
    if (query) {
      if (query.domain !== undefined) params.domain = query.domain
      if (query.bucket !== undefined) params.bucket = query.bucket
      if (query.dir) params.dir = query.dir
    }
    if (config && typeof config === 'object') config.params = params
    else config = { params }

    return TmsAxios.ins('file-api')
      .post(url, fileData, config)
      .then((rst: any) => rst.data.result)
  },
  mkdir(query: any) {
    const params: any = {}
    if (query) {
      if (query.domain !== undefined) params.domain = query.domain
      if (query.bucket !== undefined) params.bucket = query.bucket
      if (query.dir) params.dir = query.dir
    }
    let url = `${base()}/mkdir`

    return TmsAxios.ins('file-api')
      .get(url, { params })
      .then((rst: any) => rst.data.result)
  },
  rmdir(query: any) {
    const params: any = {}
    if (query) {
      if (query.domain !== undefined) params.domain = query.domain
      if (query.bucket !== undefined) params.bucket = query.bucket
      if (query.dir) params.dir = query.dir
    }
    let url = `${base()}/rmdir`

    return TmsAxios.ins('file-api')
      .get(url, { params })
      .then((rst: any) => rst.data.result)
  },
}

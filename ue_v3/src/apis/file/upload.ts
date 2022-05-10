import { TmsAxios } from 'tms-vue3'

const base = (import.meta.env.VITE_API_SERVER || '') + '/file/upload'

export default {
  plain(query, fileData, config) {
    let url = `${base}/plain`
    const params = { thumb: 'Y' }
    if (query) {
      if (query.domain !== undefined) params.domain = query.domain
      if (query.bucket !== undefined) params.bucket = query.bucket
      if (query.dir) params.dir = query.dir
    }
    if (config && typeof config === 'object') config.params = params
    else config = { params }

    return TmsAxios.ins('file-api')
      .post(url, fileData, config)
      .then((rst) => rst.data.result)
  },
  mkdir(query) {
    const params = {}
    if (query) {
      if (query.domain !== undefined) params.domain = query.domain
      if (query.bucket !== undefined) params.bucket = query.bucket
      if (query.dir) params.dir = query.dir
    }
    let url = `${base}/mkdir`

    return TmsAxios.ins('file-api')
      .get(url, { params })
      .then((rst) => rst.data.result)
  },
  rmdir(query) {
    const params = {}
    if (query) {
      if (query.domain !== undefined) params.domain = query.domain
      if (query.bucket !== undefined) params.bucket = query.bucket
      if (query.dir) params.dir = query.dir
    }
    let url = `${base}/rmdir`

    return TmsAxios.ins('file-api')
      .get(url, { params })
      .then((rst) => rst.data.result)
  },
}

import { TmsAxios } from 'tms-vue3'
import { BACK_API_URL, SUPPORT_THUMBNAIL } from '@/global'

const base = () => BACK_API_URL() + '/file/upload'

export default {
  /**
   * 上传文件
   *
   * @param query
   * @param fileData
   * @param config
   * @returns
   */
  plain(query: any, fileData: any, config: any) {
    let url = `${base()}/plain`
    const params: any = {}
    if (SUPPORT_THUMBNAIL()) params.thumb = 'Y'
    if (query) {
      if (query.domain !== undefined) params.domain = query.domain
      if (query.bucket !== undefined) params.bucket = query.bucket
      if (query.dir) params.dir = query.dir
      if (query.name) params.name = query.name
    }
    if (config && typeof config === 'object') config.params = params
    else config = { params }

    return TmsAxios.ins('file-api')
      .post(url, fileData, config)
      .then((rst: any) => rst.data.result)
  },
  /**
   * 删除文件
   * @param query
   * @returns
   */
  removeFile(query: any) {
    const params: any = {}
    if (query) {
      if (query.domain !== undefined) params.domain = query.domain
      if (query.bucket !== undefined) params.bucket = query.bucket
      if (query.filepath) params.file = query.filepath
    }
    let url = `${base()}/remove`

    return TmsAxios.ins('file-api')
      .get(url, { params })
      .then((rst: any) => rst.data.result)
  },
  /**
   * 新建目录
   *
   * @param query
   * @returns
   */
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
  /**
   * 删除目录
   * @param query
   * @returns
   */
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

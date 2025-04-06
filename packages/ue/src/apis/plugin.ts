import { TmsAxios } from 'tms-vue3'
import { BACK_API_URL } from '@/global'

const base = () => BACK_API_URL() + '/plugins'

export default {
  /**
   * 获取插件列表
   *
   * @returns
   */
  list(domain: string, bucket: string, scope: string) {
    return TmsAxios.ins('file-api')
      .post(
        `${base()}/list?domain=${domain ?? ''}&bucket=${
          bucket ?? ''
        }&scope=${scope}`
      )
      .then((rsp: any) => {
        return Promise.resolve(rsp.data.result)
      })
  },
  /**
   * 执行插件
   *
   * @returns
   */
  execute(bucket: string, params: any) {
    const { dir, pluginName, ...data } = params
    return TmsAxios.ins('file-api')
      .post(
        `${base()}/execute?bucket=${
          bucket ?? ''
        }&plugin=${pluginName}&dir=${dir}`,
        { ...data }
      )
      .then((rst: any) => {
        return Promise.resolve(rst.data)
      })
  },
}

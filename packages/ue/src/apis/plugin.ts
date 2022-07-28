import { TmsAxios } from 'tms-vue3'
import { BACK_API_URL } from '@/global'

const base = () => BACK_API_URL() + '/plugins/main'

export default {
  /**
   * 获取插件列表
   *
   * @returns
   */
  list(suffix: string) {
    return TmsAxios.ins('file-api')
      .post(`${base()}/list?suffix=${suffix}`)
      .then((rst: any) => {
        return Promise.resolve(rst.data)
      })
  },
  /**
   * 执行插件
   *
   * @returns
   */
  execute(params: any) {
    const { dir, pluginName, ...data } = params
    return TmsAxios.ins('file-api')
      .post(`${base()}/execute?plugin=${pluginName}&dir=${dir}`, { ...data })
      .then((rst: any) => {
        return Promise.resolve(rst.data)
      })
  },
}

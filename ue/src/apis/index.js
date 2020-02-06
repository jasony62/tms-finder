import createBrowse from './file/browse'
import createUpload from './file/upload'
import createManage from './file/manage'

function init(options) {
  return {
    file: {
      browse: createBrowse(options.tmsAxios.file),
      upload: createUpload(options.tmsAxios.file),
      manage: createManage(options.tmsAxios.file)
    }
  }
}

export default function install(Vue, options) {
  Vue.$apis = init(options)
  Vue.prototype.$apis = Vue.$apis
}

import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import { ElMessage } from 'element-plus'
import { TmsAxios, TmsAxiosPlugin } from 'tms-vue3'
import router from './router'
import { createPinia } from 'pinia'
import App from './App.vue'
import { plugin as dialogPlugin } from 'gitart-vue-dialog'
import {
  init as initGlobalSettings,
  LOGIN_IGNORED,
  getLocalToken,
  setLocalToken,
} from './global'
import './index.css'
import 'element-plus/dist/index.css'
import 'tms-vue3-ui/dist/es/frame/style/index.css'
import 'tms-vue3-ui/dist/es/flex/style/index.css'

function getQueryVariable(variable: string) {
  var query = window.location.search.substring(1)
  var vars = query.split('&')
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=')
    if (pair[0] == variable) {
      return pair[1]
    }
  }
  return ''
}

function configAxios() {
  let accessToken: string = ''
  if (!LOGIN_IGNORED()) {
    let token = getLocalToken()
    if (!token) router.push('/login')
    accessToken = `Bearer ${token}`
  } else {
    accessToken = 'Bearer ' + getQueryVariable('access_token')
  }
  let rulesObj: any = {
    requestHeaders: new Map([['Authorization', accessToken]]),
    onResultFault: (res: any) => {
      return new Promise((resolve, reject) => {
        ElMessage.error(res.data.msg || '发生业务逻辑错误')
        reject(res.data)
      })
    },
    // onRetryAttempt: (res: any) => {
    //   return new Promise((resolve, reject) => {
    //     if (res.data.code === 20001) {
    //       ElMessage({
    //         showClose: true,
    //         message: res.data.msg || '登录失效请重新登录',
    //         type: 'error',
    //         onClose: function () {
    //           setLocalToken('')
    //           router.push('/login')
    //         },
    //       })
    //     }
    //     reject(res.data)
    //   })
    // },
  }
  let rule = TmsAxios.newInterceptorRule(rulesObj)
  TmsAxios.ins({ name: 'file-api', rules: [rule] })
}

TmsAxios.ins({ name: 'auth-api' })

TmsAxios.ins({ name: 'master-api' })

function afterLoadSettings() {
  createApp(App)
    .use(router)
    .use(createPinia())
    .use(dialogPlugin)
    .use(TmsAxiosPlugin)
    .use(configAxios)
    .use(ElementPlus)
    .mount('#app')
}

const { VITE_BASE_URL } = import.meta.env
const UrlSettings =
  (VITE_BASE_URL && VITE_BASE_URL !== '/' ? VITE_BASE_URL : '/tmsfinder') +
  '/settings.json'

TmsAxios.ins('master-api')
  .get(UrlSettings)
  .then((rsp: any) => {
    let settings = rsp.data
    initGlobalSettings(settings)
    afterLoadSettings()
  })
  .catch(afterLoadSettings)

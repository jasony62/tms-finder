import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import { ElMessage } from 'element-plus'
import { TmsAxios, TmsAxiosPlugin, TmsLockPromise } from 'tms-vue3'
import { Login, LoginResponse } from 'tms-vue3-ui'
import router from './router'
import { createPinia } from 'pinia'
import App from './App.vue'
import { plugin as dialogPlugin } from 'gitart-vue-dialog'
import {
  init as initGlobalSettings,
  LOGIN_IGNORED,
  getLocalToken,
  setLocalToken,
  getQueryVariable,
} from './global'
import './index.css'
import 'element-plus/dist/index.css'
import 'tms-vue3-ui/dist/es/frame/style/index.css'
import 'tms-vue3-ui/dist/es/flex/style/index.css'
import './assets/common.scss'
import apiAuth from '@/apis/auth'
import { schema } from '@/data/login'
const { fnCaptcha, fnLogin } = apiAuth

const LoginPromise = (function () {
  let ins = new TmsLockPromise(function () {
    return new Promise((resolve) => {
      const fnSuccessLogin = function (response: LoginResponse) {
        const token = response.result.access_token
        setLocalToken(token)
        resolve(`Bearer ${token}`)
      }
      Login.open({
        schema: schema(),
        fnCaptcha,
        fnLogin,
        onSuccess: fnSuccessLogin,
        closeAfterSuccess: true,
      })
    })
  })
  return ins
})()

function getAccessToken() {
  if (!LOGIN_IGNORED()) {
    if (LoginPromise.isRunning()) {
      return LoginPromise.wait()
    }

    let token = getLocalToken()
    if (!token) {
      return LoginPromise.wait()
    }
    return `Bearer ${token}`
  } else {
    return 'Bearer ' + getQueryVariable('access_token')
  }
}

function onRetryAttempt(res: any) {
  if (res.data.code === 20001) {
    return LoginPromise.wait().then(() => {
      return true
    })
  }
  return false
}

let rulesObj: any = {
  requestHeaders: new Map([['Authorization', getAccessToken]]),
  onResultFault: (res: any) => {
    return new Promise((resolve, reject) => {
      ElMessage.error(res.data.msg || '发生业务逻辑错误')
      reject(res.data)
    })
  },
  onRetryAttempt,
}
let rule = TmsAxios.newInterceptorRule(rulesObj)

TmsAxios.ins({ name: 'file-api', rules: [rule] })
TmsAxios.ins({ name: 'auth-api' })
TmsAxios.ins({ name: 'master-api' })

function afterLoadSettings() {
  createApp(App)
    .use(router)
    .use(createPinia())
    .use(dialogPlugin)
    .use(TmsAxiosPlugin)
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

import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import { ElMessage } from 'element-plus'
import {
  TmsAxios,
  TmsAxiosPlugin,
  TmsLockPromise,
  TmsRouterHistoryPlugin,
} from 'tms-vue3'
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
  BASE_URL,
} from './global'
import './index.css'
import 'element-plus/dist/index.css'
import 'tms-vue3-ui/dist/es/frame/style/index.css'
import 'tms-vue3-ui/dist/es/flex/style/index.css'
import './assets/css/app.css'
import apiAuth from '@/apis/auth'
import { schema } from '@/data/login'
import Debug from 'debug'

localStorage.debug = '*'

const debug = Debug('tfd:main')

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
/**
 * 如果是认证相关的错误，重新登录
 *
 * @param res
 * @returns
 */
function onRetryAttempt(res: any) {
  debug('API执行失败\n%O', res.data)
  if (res.data.code === 20001 || res.data.code === 10001) {
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
      const { responseURL } = res.request
      /**
       * 获取不到bucket的schemas不是错误
       */
      if (
        /admin\/bucket\/schemas/.test(responseURL) &&
        res.data.code === 40420
      ) {
        return reject(res.data)
      }
      ElMessage.error({
        message: res.data.msg || '发生业务逻辑错误',
        duration: 0,
        showClose: true,
      })
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
    .use(TmsRouterHistoryPlugin, { router })
    .use(ElementPlus)
    .use({
      /**
       * 为了解决在路由中可以访问app实例问题
       * @param app
       */
      install: (app) => {
        //@ts-ignore
        window['_VueApp'] = app
      },
    })
    .mount('#app')
}

TmsAxios.ins('master-api')
  .get(`${BASE_URL}/settings.json`)
  .then((rsp: any) => {
    const settings = rsp.data
    initGlobalSettings(settings)
    afterLoadSettings()
  })
  .catch(afterLoadSettings)

import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import { ElMessage } from 'element-plus'
import {
  TmsAxios,
  TmsAxiosPlugin,
  TmsErrorPlugin,
  TmsIgnorableError,
  TmsLockPromise,
  TmsRouterHistoryPlugin,
} from 'tms-vue3'
import router from './router'
import { createPinia } from 'pinia'
import App from './App.vue'
import { plugin as dialogPlugin } from 'gitart-vue-dialog'
import {
  init as initGlobalSettings,
  AUTH_DISABLED,
  getLocalToken,
  setLocalToken,
} from './global'
import './index.css'
import 'element-plus/dist/index.css'
import 'tms-vue3-ui/dist/es/frame/style/index.css'
import 'tms-vue3-ui/dist/es/flex/style/index.css'
import { Login, SubmitDataItem, LoginResponse } from 'tms-vue3-ui'
import apiAuth from '@/apis/auth'
const { fnCaptcha, fnLogin } = apiAuth

function getQueryVariable(variable: string) {
  var query = window.location.search.substring(1)
  var vars = query.split('&')
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=')
    if (pair[0] == variable) {
      return `Bearer ${pair[1]}`
    }
  }
  return ''
}

const LoginSchema: SubmitDataItem[] = [
  {
    key: import.meta.env.VITE_APP_LOGIN_KEY_USERNAME || 'uname',
    type: 'text',
    placeholder: '用户名',
  },
  {
    key: import.meta.env.VITE_APP_LOGIN_KEY_PASSWORD || 'password',
    type: 'password',
    placeholder: '密码',
  },
  {
    key: import.meta.env.VITE_APP_LOGIN_KEY_PIN || 'pin',
    type: 'captcha',
    placeholder: '验证码',
  },
]

const LoginPromise = (function () {
  const fnSuccessLogin = function (response: LoginResponse) {
    const token = response.result.access_token
    setLocalToken(token)

    return `Bearer ${token}`
  }
  let ins = new TmsLockPromise(function () {
    return Login.open({
      schema: LoginSchema,
      fnCaptcha,
      fnLogin,
      onSuccess: fnSuccessLogin,
    })
  })
  return ins
})()

function getAccessToken() {
  if (LoginPromise.isRunning()) {
    return LoginPromise.wait()
  }

  let token = getLocalToken()
  if (!token) {
    return LoginPromise.wait()
  }

  return `Bearer ${token}`
}

function onRetryAttempt(res: any) {
  if (res.data.code === 20001) {
    return LoginPromise.wait().then(() => {
      return true
    })
  }
  return false
}

function onResultFault(res: any) {
  ElMessage({
    showClose: true,
    message: res.data.msg,
    duration: 3000,
    type: 'error',
  })
  return Promise.reject(new TmsIgnorableError(res.data))
}

function onResponseRejected(err: any) {
  return Promise.reject(new TmsIgnorableError(err))
}

let rules = []
if (!AUTH_DISABLED()) {
  let accessTokenRule = TmsAxios.newInterceptorRule({
    requestHeaders: new Map([['Authorization', getAccessToken]]),
    onRetryAttempt,
  })
  rules.push(accessTokenRule)
}

let responseRule = TmsAxios.newInterceptorRule({
  onResultFault,
  onResponseRejected,
})
rules.push(responseRule)

TmsAxios.ins({ name: 'auth-api' })
TmsAxios.ins({ name: 'master-api', rules: rules })
TmsAxios.ins({ name: 'file-api', rules: rules })

function afterLoadSettings() {
  createApp(App)
    .use(router)
    .use(createPinia())
    .use(dialogPlugin)
    .use(TmsAxiosPlugin)
    .use(TmsErrorPlugin)
    .use(TmsRouterHistoryPlugin, { router })
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

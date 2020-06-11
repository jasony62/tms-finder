import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import { Message } from 'element-ui'
import { TmsAxiosPlugin, TmsErrorPlugin, TmsEventPlugin, TmsIgnorableError, TmsLockPromise } from 'tms-vue'
import { Frame, Flex, Login } from 'tms-vue-ui'
import ApiPlugin from './apis'
import auth from './apis/auth'
import utils from './utils'
import './assets/icon/iconfont.js'
import './assets/icon/icon.css'

Vue.config.productionTip = false

Vue.prototype.$utils = utils

Vue.use(TmsAxiosPlugin)
  .use(TmsErrorPlugin)
  .use(TmsEventPlugin)
  .use(Frame)
  .use(Flex)

function onResultFault(res) {
  Message({
    showClose: true,
    message: res.data.msg,
    type: 'error',
    duration: 0,
  })
  return Promise.reject(new TmsIgnorableError(res.data))
}
// 处理请求过程中发生的异常
function onResponseRejected(err) {
  return Promise.reject(new TmsIgnorableError(err))
}

const RequireLogin = process.env.VUE_APP_AUTH_DISABLED !== 'Yes' && process.env.VUE_APP_AUTH_SERVER

let rules = [] // axios拦截器规则
/**
 * 用户认证
 */
if (RequireLogin) {
  const { fnGetCaptcha, fnGetJwt } = auth
  const LoginSchema = [
    {
      key: process.env.VUE_APP_LOGIN_KEY_USERNAME || 'username',
      type: 'text',
      placeholder: '用户名',
    },
    {
      key: process.env.VUE_APP_LOGIN_KEY_PASSWORD || 'password',
      type: 'password',
      placeholder: '密码',
    },
    {
      key: process.env.VUE_APP_LOGIN_KEY_PIN || 'pin',
      type: 'code',
      placeholder: '验证码',
    },
  ]
  Vue.use(Login, { schema: LoginSchema, fnGetCaptcha, fnGetToken: fnGetJwt })
  /**
   * 请求中需要包含认证信息
   */
  const LoginPromise = (function() {
    let login = new Login(LoginSchema, fnGetCaptcha, fnGetJwt)
    let ins = new TmsLockPromise(function() {
      return login.showAsDialog().then((token) => {
        sessionStorage.setItem('access_token', token)
        return `Bearer ${token}`
      })
    })
    return ins
  })()

  const getAccessToken = function() {
    // 如果正在登录，等待结果
    if (LoginPromise.isRunning()) {
      return LoginPromise.wait()
    }
    // 如果没有token，发起登录
    let token = sessionStorage.getItem('access_token')
    if (!token) {
      return LoginPromise.wait()
    }

    return `Bearer ${token}`
  }

  const onRetryAttempt = function(res) {
    if (res.data.code === 20001) {
      return LoginPromise.wait().then(() => {
        return true
      })
    }
    return false
  }
  let accessTokenRule = Vue.TmsAxios.newInterceptorRule({
    requestHeaders: new Map([['Authorization', getAccessToken]]),
    onRetryAttempt,
  })
  rules.push(accessTokenRule)
}

let responseRule = Vue.TmsAxios.newInterceptorRule({
  onResultFault,
  onResponseRejected,
})
rules.push(responseRule)

/* API调用是否传递cookie */
const config = {}
if (/yes|true/i.test(process.env.VUE_APP_API_PASS_COOKIE)) config.withCredentials = true

const tmsAxios = {}
tmsAxios.file = Vue.TmsAxios({ name: 'file-api', rules, config })
if (RequireLogin) tmsAxios.auth = Vue.TmsAxios({ name: 'auth-api' })
Vue.use(ApiPlugin, { tmsAxios })

new Vue({
  store,
  router,
  render: (h) => h(App),
}).$mount('#app')

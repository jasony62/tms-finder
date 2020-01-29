import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import { Message } from 'element-ui'
import { TmsAxiosPlugin, TmsErrorPlugin, TmsIgnorableError, TmsLockPromise } from 'tms-vue'
import { Login } from 'tms-vue-ui'
import auth from './apis/auth'

Vue.config.productionTip = false

Vue.use(TmsAxiosPlugin).use(TmsErrorPlugin)

const { fnGetCaptcha, fnGetJwt } = auth
const LoginSchema = [
  {
    key: process.env.VUE_APP_LOGIN_KEY_USERNAME || 'username',
    type: 'text',
    placeholder: '用户名'
  },
  {
    key: process.env.VUE_APP_LOGIN_KEY_PASSWORD || 'password',
    type: 'password',
    placeholder: '密码'
  },
  {
    key: process.env.VUE_APP_LOGIN_KEY_PIN || 'pin',
    type: 'code',
    placeholder: '验证码'
  }
]
Vue.use(Login, { schema: LoginSchema, fnGetCaptcha, fnGetToken: fnGetJwt })
/**
 * 请求中需要包含认证信息
 */
const LoginPromise = (function() {
  let login = new Login(LoginSchema, fnGetCaptcha, fnGetJwt)
  let ins = new TmsLockPromise(function() {
    return login.showAsDialog().then(token => {
      sessionStorage.setItem('access_token', token)
      return `Bearer ${token}`
    })
  })
  return ins
})()

function getAccessToken() {
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

function onRetryAttempt(res) {
  if (res.data.code === 20001) {
    return LoginPromise.wait().then(() => {
      return true
    })
  }
  return false
}

function onResultFault(res) {
  Message({
    showClose: true,
    message: res.data.msg,
    type: 'error',
    duration: 0
  })
  return Promise.reject(new TmsIgnorableError(res.data))
}
// 处理请求过程中发生的异常
function onResponseRejected(err) {
  return Promise.reject(new TmsIgnorableError(err))
}

let rules = []
if (process.env.VUE_APP_BACK_AUTH_SERVER) {
  let accessTokenRule = Vue.TmsAxios.newInterceptorRule({
    requestHeaders: new Map([['Authorization', getAccessToken]]),
    onRetryAttempt
  })
  rules.push(accessTokenRule)
}
let responseRule = Vue.TmsAxios.newInterceptorRule({
  onResultFault,
  onResponseRejected
})
rules.push(responseRule)

Vue.TmsAxios({ name: 'file-api', rules })

Vue.TmsAxios({ name: 'auth-api' })

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')

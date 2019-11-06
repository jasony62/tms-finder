import Vue from "vue"
import App from "./App.vue"
import store from "./store"
import routes from "./router"
import VueRouter from 'vue-router'

import { TmsAxiosPlugin } from 'tms-vue'
Vue.use(TmsAxiosPlugin)

const name = 'file-api'
let rule = Vue.TmsAxios.newInterceptorRule({
  requestParams: new Map([['access_token', '']]),
  onRetryAttempt: (res, rule) => {
    return new Promise(resolve => {
      rule.requestParams.set('access_token', localStorage.getItem('access_token'))
      resolve(true)
    })
  }
})
Vue.TmsAxios({name, rules: [rule]})

Vue.use(VueRouter)
Vue.config.productionTip = false

const router = new VueRouter({
  routes
});

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount("#app")

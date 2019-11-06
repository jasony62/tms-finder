import Vue from "vue"
import App from "./App.vue"
import store from "./store"
import routes from "./router"
import VueRouter from 'vue-router'

import { TmsAxiosPlugin } from 'tms-vue'
Vue.use(TmsAxiosPlugin)

Vue.use(VueRouter)
Vue.config.productionTip = false

const router = new VueRouter({
  routes
});

const name = 'file-api'
let rule = Vue.TmsAxios.newInterceptorRule({
  requestParams: new Map([['access_token', '']]),
  onRetryAttempt: (res, rule) => {
    console.log(typeof res.data.code);
    // 缺少access_token
    if (res.data.code === 10001) {
      return new Promise(resolve => {
        rule.requestParams.set('access_token', localStorage.getItem('access_token'))
        resolve(true)
      })
    } else if(res.data.code === 20001){
      // access_token过期
      router.push('/login');
    }
  }
})
Vue.TmsAxios({name, rules: [rule]})

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount("#app")

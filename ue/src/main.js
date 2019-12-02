import Vue from "vue"
import App from "./App.vue"
import store from "./store"
import routes from "./router"
import VueRouter from 'vue-router'
import { Message } from 'element-ui'
import { TmsAxiosPlugin } from 'tms-vue'
Vue.use(TmsAxiosPlugin)

Vue.use(VueRouter)
Vue.config.productionTip = false

const router = new VueRouter({
  routes
});

const name = 'file-api'
let rule = Vue.TmsAxios.newInterceptorRule({
  requestParams: new Map([['access_token', localStorage.getItem('access_token') || '']]),
  onRetryAttempt: (res) => {
   if(res.data.code === 20001){
      // access_token过期
      router.push('/login');
      return Promise.resolve(false)
    }
  },
  // onResultFault: res => {
  //   console.log(res)
  //   return new Promise(resolve => {
  //     Message({ message: res.data.msg, type: 'error', showClose: true })
  //     resolve(true)
  //   })
  // }
})
Vue.TmsAxios({name, rules: [rule]})

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount("#app")

import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Storage from '../components/Storage'
import Manage from '../components/Manage'
import NotFound from '../components/NotFound'
import { TmsRouterHistoryPlugin } from 'tms-vue'

const VUE_APP_BASE_URL = process.env.VUE_APP_BASE_URL ? process.env.VUE_APP_BASE_URL : ''

const routes = [
  {
    path: `${VUE_APP_BASE_URL}/web/login`,
    component: Login,
    name: 'login'
  },
  {
    path: `${VUE_APP_BASE_URL}/web/manage`,
    component: Manage,
    name: 'manage'
  },
  {
    path: `${VUE_APP_BASE_URL}/web/storage`,
    component: Storage,
    name: 'storage'
  },
  {
    path: `${VUE_APP_BASE_URL}/web`,
    component: Manage,
    name: 'root'
  },
  {
    path: '*',
    component: NotFound
  }
]
Vue.use(VueRouter).use(TmsRouterHistoryPlugin)

let router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  if (to.name !== 'login') {
    let token = sessionStorage.getItem('access_token')
    if (!token) {
      Vue.TmsRouterHistory.push(to.path)
      return next({ name: 'login' })
    }
  }
  next()
})

router = Vue.TmsRouterHistory.watch(router)

export default router

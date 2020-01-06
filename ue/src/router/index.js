import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Finder from '../components/Finder'
import NotFound from '../components/NotFound'
import { TmsRouterHistoryPlugin } from 'tms-vue'

const routes = [
  {
    path: '/login',
    component: Login,
    name: 'login'
  },
  {
    path: '/finder',
    component: Finder,
    name: 'finder'
  },
  {
    path: '/',
    component: Finder,
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
      return next('/login')
    }
  }
  next()
})

router = Vue.TmsRouterHistory.watch(router)

export default router

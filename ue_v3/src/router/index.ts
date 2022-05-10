import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Login from '../views/Login.vue'
import Storage from '../views/Storage.vue'
import Manage from '../views/Manage.vue'
import NotFound from '../views/NotFound.vue'

const VITE_BASE_URL = typeof import.meta.env.VITE_BASE_URL === 'string' ? import.meta.env.VITE_BASE_URL : ''

const routes = [
  {
    path: `${VITE_BASE_URL}/web/login`,
    name: 'login',
    component: Login,
  },
  {
    path: `${VITE_BASE_URL}/web/manage`,
    name: 'manage',
    props: (route: any) => ({ domain: route.query.domain, bucket: route.query.bucket }),
    component: Manage,
  },
  {
    path: `${VITE_BASE_URL}/web/storage`,
    name: 'storage',
    props: (route: any) => ({ domain: route.query.domain, bucket: route.query.bucket }),
    component: Storage,
  },
  {
    path: `${VITE_BASE_URL}/web`,
    name: 'root',
    props: (route: any) => ({ domain: route.query.domain, bucket: route.query.bucket }),
    component: (() => {
      /*如果设置了文件schema就默认进入管理视图，否则进入存储视图*/
      return !/no|false/i.test(import.meta.env.VITE_SUPPORT_SET_INFO) ? Manage : Storage
    })(),
  },
  {
    path: '/',
    component: NotFound,
  },
]

const router = createRouter({
  history: createWebHistory(VITE_BASE_URL),
  routes,
})

// router.beforeEach((to, from, next) => {
//   // 进入页面前检查是否已经通过用户认证
//   if (import.meta.env.VITE_AUTH_DISABLED !== 'Yes' && import.meta.env.VITE_AUTH_SERVER) {
//     if (to.name !== 'login') {
//       let token = sessionStorage.getItem('access_token')
//       if (!token) {
//         Vue.TmsRouterHistory.push(to.path)
//         return next({ name: 'login' })
//       }
//     }
//   }
//   next()
// })

// router = Vue.TmsRouterHistory.watch(router)

export default router

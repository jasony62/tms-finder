import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Storage from '../views/Storage.vue'
import Manage from '../views/Manage.vue'
import Register from '../views/Register.vue'
import Smscode from '../views/Smscode.vue'

import { TmsRouterHistory } from 'tms-vue3'
import { LOGIN_IGNORED, getLocalToken } from '@/global'

const BASE_URL = import.meta.env.VITE_BASE_URL
  ? import.meta.env.VITE_BASE_URL
  : '/tmsfinder'

const routes = [
  {
    path: `/login`,
    name: 'login',
    component: Login,
  },
  {
    path: `/register`,
    name: 'register',
    component: Register,
    props: true,
  },
  {
    path: `/smscode`,
    name: 'smscode',
    component: Smscode,
    props: true,
  },
  {
    path: `/web/manage`,
    name: 'manage',
    props: (route: any) => ({
      domain: route.query.domain,
      bucket: route.query.bucket,
    }),
    component: Manage,
  },
  {
    path: `/web/storage`,
    name: 'storage',
    props: (route: any) => ({
      domain: route.query.domain,
      bucket: route.query.bucket,
    }),
    component: Storage,
  },
  {
    path: `/web`,
    name: 'root',
    props: (route: any) => ({
      domain: route.query.domain,
      bucket: route.query.bucket,
    }),
    component: (() => {
      /*如果设置了文件schema就默认进入管理视图，否则进入存储视图*/
      return Storage
    })(),
  },
  {
    path: '/',
    redirect: { name: 'root' },
  },
]

const router = createRouter({
  history: createWebHistory(BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  // 进入页面前检查是否已经通过用户认证
  if (!LOGIN_IGNORED()) {
    if (to.name !== 'login') {
      let token = getLocalToken()
      if (!token) {
        new TmsRouterHistory().push(to.path)
        return next({ name: 'login' })
      }
    }
  }
  next()
})

// router = Vue.TmsRouterHistory.watch(router)

export default router

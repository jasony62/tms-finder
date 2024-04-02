import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Storage from '../views/Storage.vue'
import Manage from '../views/Manage.vue'
import Register from '../views/Register.vue'
import Smscode from '../views/Smscode.vue'
import { TmsRouterHistory } from 'tms-vue3'
import {
  EXTERNAL_LOGIN_URL,
  LOGIN_IGNORED,
  getLocalToken,
  removeLocalToken,
  externalLogin,
} from '@/global'
import facStore from '@/store'
import apiAuth from '@/apis/auth'

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

/**
 * 客户端登出
 */
async function logout() {
  const access_token = getLocalToken()
  if (access_token) {
    // 清除token
    removeLocalToken()
    // 通知服务端登出
    await apiAuth.fnLogout(access_token)
  }
}

router.beforeEach(async (to, from, next) => {
  if (!LOGIN_IGNORED()) {
    const routeName = to.name ?? 'root'
    if ('logout' === routeName) {
      await logout()
      return next({ name: 'login' })
    }
    // 进入页面前检查是否已经通过用户认证
    // if (to.name !== 'login') {
    if (['login', 'register', 'smscode'].indexOf(routeName.toString()) === -1) {
      let token = getLocalToken()
      if (!token) {
        if (EXTERNAL_LOGIN_URL()) {
          return externalLogin()
        }
        //@ts-ignore
        const vueApp = window['_VueApp']
        if (vueApp) {
          const routerHistory = vueApp.config.globalProperties.$tmsRouterHistory
          if (routerHistory) routerHistory.push(to.path)
        }
        return next({ name: 'login' })
      } else {
        /**
         * 如果没有当前用户的信息，获取信息
         */
        const store = facStore()
        if (!store.clientInfo.id) {
          apiAuth.fnClient(token).then((result: any) => {
            Object.assign(store.clientInfo, result)
          })
        }
      }
    } else if (EXTERNAL_LOGIN_URL()) {
      console.log('执行第三方登录')
      return externalLogin()
    }
  }
  next()
})

// router = Vue.TmsRouterHistory.watch(router)

export default router

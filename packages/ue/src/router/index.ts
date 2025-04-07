import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Storage from '../views/Storage.vue'
import Manage from '../views/Manage.vue'
import Register from '../views/Register.vue'
import Smscode from '../views/Smscode.vue'
import Bucket from '../views/Bucket.vue'
import JoinBucket from '../views/JoinBucket.vue'
import {
  EXTERNAL_LOGIN_URL,
  LOGIN_IGNORED,
  getLocalToken,
  removeLocalToken,
  externalLogin,
  BUCKET_MODE,
  BASE_URL,
} from '@/global'
import facStore from '@/store'
import apiAuth from '@/apis/auth'
import Coworker from '@/views/Coworker.vue'
import Debug from 'debug'

const debug = Debug('tfd:router')

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
    path: '/bucket',
    name: 'bucket',
    component: Bucket,
  },
  {
    path: '/bucket/:bucket/coworker',
    name: 'coworker',
    component: Coworker,
    props: true,
  },
  {
    path: '/bucket/:bucket/join/:nickname/:code',
    name: 'joinbucket',
    component: JoinBucket,
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
    props: (route: any) => {
      return {
        domain: route.query.domain,
        bucket: route.query.bucket,
      }
    },
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
        /**
         * 如果是空间模式，检查是否已经有空间，是否已经指定空间，如果没有进入空间管理页
         */
        if (BUCKET_MODE()) {
          /**
           * 获得bucket扩展定义
           */
          await store.getBucketSchemas()
          /**
           * 是否自动进入bucket管理
           */
          if (
            routeName !== 'bucket' &&
            routeName !== 'coworker' &&
            routeName !== 'joinbucket' &&
            !to.query.bucket
          ) {
            debug('应用为bucket模式，检查用户是否已经创建bucket')
            const store = facStore()
            const { buckets } = await store.listBucket()
            /**
             * 没有空间，引导用户进行创建
             */
            if (!Array.isArray(buckets) || buckets.length === 0) {
              return next({ name: 'bucket' })
            }
            const defaultBucket = buckets.find(
              (bucket) => bucket.asdefault === true
            )
            /**
             * 指定了默认空间
             */
            if (defaultBucket) {
              return next({
                path: to.path,
                query: Object.assign(to.query, { bucket: defaultBucket.name }),
              })
            }
            return next({ name: 'bucket' })
          }
        }
      }
    } else if (EXTERNAL_LOGIN_URL()) {
      console.log('执行第三方登录')
      return externalLogin()
    }
  }
  next()
})

export default router

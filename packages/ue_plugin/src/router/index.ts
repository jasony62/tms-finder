import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import DirExport from '@/views/DirExport.vue'

const BASE_URL = import.meta.env.VITE_BASE_URL
  ? import.meta.env.VITE_BASE_URL
  : '/plugin'

const routes: RouteRecordRaw[] = [
  {
    path: '/dir-export',
    name: 'dirExport',
    component: DirExport,
  },
]

const router = createRouter({
  history: createWebHistory(BASE_URL),
  routes,
})

export default router

// @ts-nocheck
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

import './index.css'
import 'element-plus/dist/index.css'

localStorage.debug = '*'

createApp(App).use(router).use(ElementPlus, { locale: zhCn }).mount('#app')

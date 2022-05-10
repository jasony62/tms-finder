import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import { TmsAxios, TmsAxiosPlugin } from 'tms-vue3'
import { Frame, Flex } from 'tms-vue3-ui'
import router from './router'
import { createPinia } from 'pinia'
import App from './App.vue'

import './index.css'
import 'element-plus/dist/index.css'
import 'tms-vue3-ui/dist/es/frame/style/index.css'
import 'tms-vue3-ui/dist/es/flex/style/index.css'

createApp(App).use(router).use(createPinia()).use(TmsAxiosPlugin).use(Frame).use(Flex).use(ElementPlus).mount('#app')

TmsAxios.ins({ name: 'file-api' })
TmsAxios.ins({ name: 'auth-api' })

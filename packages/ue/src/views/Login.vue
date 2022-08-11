<template>
  <div class="grid place-items-center h-screen">
    <div class="border-2 rounded w-1/4">
      <login :schema="schema()" :fn-captcha="fnCaptcha" :fn-login="fnLogin" :on-success="fnSuccessLogin"
        :on-fail="fnFailLogin">
      </login>
      <div class="flex flex-nowrap pb-4">
        <router-link class="flex-grow pl-4" :to="{ path: 'Smscode' }">短信登录</router-link>
        <router-link class="flex-grow text-right pr-4" :to="{ path: 'register' }">注册</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Login, LoginResponse } from 'tms-vue3-ui'
import 'tms-vue3-ui/dist/es/login/style/tailwind.scss'
import { schema } from '@/data/login'
import apiAuth from '@/apis/auth'
import { setLocalToken } from '@/global'

const { fnCaptcha, fnLogin } = apiAuth
const { proxy }: any = getCurrentInstance()
const router = useRouter()

const fnSuccessLogin = (response: LoginResponse) => {
  if (response.result && response.result.access_token) {
    setLocalToken(response.result.access_token)
    if (proxy.$tmsRouterHistory.canBack()) {
      router.back()
    } else {
      router.push({ name: 'root' })
    }
  }
}

const fnFailLogin = (response: LoginResponse) => {
  ElMessage.error(response.msg || '登录失败')
}
</script>
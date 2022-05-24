<template>
  <div class="grid place-items-center h-screen">
    <div class="border-2 rounded w-1/4">
      <register
        :schema="schema"
        :fn-captcha="fnCaptcha"
        :fn-register="fnRegister"
        :on-success="fnSuccessToken"
        :on-fail="fnFailToken"
      >
      </register>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Register } from 'tms-vue3-ui'
import { ElMessage } from 'element-plus'
import 'tms-vue3-ui/dist/es/register/style/tailwind.scss'

import { schema } from '@/data/register'
import apiLogin from '@/apis/login'
import apiRegister from '@/apis/register'
import router from '@/router/index'
const { fnCaptcha } = apiLogin
const { fnRegister } = apiRegister
const showRegisterDialog = () => {
  Register.open({ schema, fnCaptcha, fnRegister })
}
const fnSuccessToken = (token: string) => {
  if(token){
    ElMessage({
      showClose: true,
      message: '注册成功，即将跳转登录。',
      type: 'success',
      onClose: function(){
        router.push('/login')
      }
      })
  }
  
}
const fnFailToken = (response: any) => {
  ElMessage.error(response.msg||'注册失败')
}
</script>
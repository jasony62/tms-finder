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
import 'tms-vue3-ui/dist/es/register/style/tailwind.scss'

import { schema, fnRegister } from '@/data/register'
import apiLogin from '@/apis/auth'
const { fnCaptcha } = apiLogin

const showRegisterDialog = () => {
  Register.open({ schema, fnCaptcha, fnRegister })
}
const fnSuccessToken = (token: string) => {
  console.log('已获得token:' + token)
}
const fnFailToken = (msg: string) => {
  console.log(msg)
}
</script>
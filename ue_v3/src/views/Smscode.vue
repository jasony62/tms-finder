<template>
  <div class="grid place-items-center h-screen">
    <div class="border-2 rounded w-1/4">
      <sms-code
        :schema="schema"
        action-text="登录"
        :fn-send-code="fnSendCode"
        :fn-send-sms-code="fnSendSmsCode"
        :fn-verify="fnVerify"
        :on-success="fnSuccessVerify"
        :on-fail="fnFailVerify"
      >
      </sms-code>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SmsCode } from 'tms-vue3-ui'
import 'tms-vue3-ui/dist/es/sms-code/style/tailwind.scss'
import { fnVerify, schema, fnSendSmsCode } from '@/data/smscode'
import apiLogin from '@/apis/login'

const { fnCaptcha: fnSendCode } = apiLogin
const showSmsCodeDialog = () => {
  SmsCode.open({ schema, fnSendCode, fnVerify })
}
const fnSuccessVerify = (token: string) => {
  console.log('已获得token:' + token)
}
const fnFailVerify = (msg: string) => {
  console.log(msg)
}
</script>
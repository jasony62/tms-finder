<template>
  <div class="login">
    <tms-login :data="data" :submit="onGetJwt" class="tms-finder"></tms-login>
  </div>
</template>
<script>
import Vue from 'vue'

import { Login } from 'tms-vue-ui'
import browser from '../apis/file/browse'
const { fnGetCaptcha, fnGetJwt } = browser
Vue.use(Login, { fnGetCaptcha, fnGetToken: fnGetJwt })
export default {
  data() {
    return {
      asDialog: false,
      data: [
        {
          key: process.env.VUE_APP_LOGIN_KEY_USERNAME || 'username',
          type: 'text',
          placeholder: '用户名'
        },
        {
          key: process.env.VUE_APP_LOGIN_KEY_PASSWORD || 'password',
          type: 'password',
          placeholder: '密码'
        },
        {
          key: process.env.VUE_APP_LOGIN_KEY_PIN || 'pin',
          type: 'code',
          placeholder: '验证码'
        }
      ]
    }
  },
  methods: {
    onGetJwt(token) {
      sessionStorage.setItem('access_token', token)
      if (this.asDialog) {
        this.$emit('success', token)
      } else {
        if (this.$tmsRouterHistory.canBack()) {
          this.$router.back()
        } else {
          this.$router.push('/')
        }
      }
    },
    showDialog() {
      this.asDialog = true
      this.$mount()
      document.body.appendChild(this.$el)
      return new Promise(resolve => {
        this.$once('success', token => {
          document.body.removeChild(this.$el)
          resolve(token)
        })
      })
    }
  }
}
</script>
<style scope>
.login {
  display: flex;
  justify-content: center;
  margin-top: 200px;
  /* transform: translate(-50%, -50%); */
}
.login .tms-finder {
  border: 1px solid #ddd;
}
</style>
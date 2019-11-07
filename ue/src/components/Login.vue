<template>
  <div class="login">
    <tms-login :data="data" :submit="getTokenSuccess" class="tms-finder">
    </tms-login> 
  </div>
</template>
<script>
import Vue from 'vue'
import { Login } from 'tms-vue-ui'
import browser from '../apis/file/browse'
const { fnGetCaptcha, fnGetToken, cbCreateAxios } = browser
Vue.use(Login, { fnGetCaptcha, fnGetToken })
export default {
  data() {
    return {
      data: [
        {
          // 当前双向绑定的属性名
          key: 'uname',
          // 组件类型
          type: 'text',
          placeholder: '用户名'
        },
        {
          key: 'password',
          type: 'password',
          placeholder: '密码'
        },
        {
          key: 'pin',
          type: 'code',
          placeholder: '验证码'
        }
      ]
    }
  },
  methods: {
    getTokenSuccess(token) {
      localStorage.setItem('access_token', token)
      // 去掉之前的token
      this.TmsAxios.remove('access_token');
      // 添加token
      this.TmsAxios('file-api').rules[0].requestParams.set('access_token', token)
      this.$router.push('/finder')
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
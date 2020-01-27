<template>
  <div class="login">
    <tms-login :on-success="onGetJwt" class="tms-finder"></tms-login>
  </div>
</template>
<script>
export default {
  methods: {
    onGetJwt(token) {
      sessionStorage.setItem('access_token', token)
      if (this.$tmsRouterHistory.canBack()) {
        this.$router.back()
      } else {
        this.$router.push('/')
      }
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
<template>
  <div id="app">
    <button @click="upload">上传文件</button>
  </div>
</template>

<script>
import Vue from 'vue'
import { tmsImportLib } from 'tms-vue'

export default {
  name: 'app',
  methods: {
    async upload() {
      const libUrl = process.env.VUE_APP_UPLOAD_LIB_URL
      const compOptions = await tmsImportLib('Upload', libUrl)
      const CompClass = Vue.extend(compOptions)
      const comp = new CompClass({
        propsData: {
          tmsAxiosName: 'file-api'
        }
      })
      comp.$mount()
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

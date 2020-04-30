<template>
  <el-dialog class="abow_dialog" title="文件信息" :closeOnClickModal="false" :visible="true" @close="onClose" width="90%" top="4vh">
    <div>
      <iframe
        id="iframe"
        width="100%"
        height="100%"
        frameborder="0"
        :src="fileurl"
        marginwidth="0"
        marginheight="0"
        scrolling="auto"
        @load="iframeLoad"
      ></iframe>
    </div>
</el-dialog>
</template>

<script>
import { Dialog } from 'element-ui'

const componentOptions = {
  components: { 'el-dialog': Dialog },
  props: {
    tmsAxiosName: { type: String },
    fileurl: String,
    domain: String,
    bucket: String
  },
  mounted() {
    document.body.appendChild(this.$el)
  },
  beforeDestroy() {
    document.body.removeChild(this.$el)
  },
  methods: {
    iframeLoad(){
      var ifm = document.getElementById("iframe"); 
      ifm.height = document.documentElement.clientHeight - 157;
    },
    onClose() {
      this.$destroy()
    }
  }
}

export default componentOptions

export function createAndMount(Vue, props) {
  const CompClass = Vue.extend(componentOptions)

  const propsData = {
    tmsAxiosName: 'file-api'
  }
  if (props && typeof props === 'object') Object.assign(propsData, props)

  new CompClass({
    propsData
  }).$mount()
}
</script>
<style lang="less">
  .abow_dialog {
    display: flex;
    justify-content: center;
    align-items: Center;
    overflow: hidden;
    .el-dialog {
      margin: 0 auto !important;
      height: 90%;
      overflow: hidden;
    }
    .el-dialog__body {
      position: absolute;
      left: 0;
      top: 54px;
      bottom: 0;
      right: 0;
      padding: 0;
      z-index: 1;
      overflow: hidden;
    }
  }
</style>
<template>
  <div class="hello">
    <div>返回结果：{{ returnData }}</div>
    <div>
      <iframe
        id="iframe"
        width="100%"
        height="100%"
        frameborder="0"
        :src="url"
        marginwidth="0"
        marginheight="0"
        scrolling="no"
        @load="iframeLoad"
      ></iframe>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      url: 'http://localhost:9010/web/storage',
      returnData: '',
    }
  },
  created() {
    window.addEventListener(
      'message',
      (e) => {
        const origin = event.origin || event.originalEvent.origin
        if (origin === 'http://localhost:9010') {
          this.returnData = e.data
          this.dialogVisible = false
        }
      },
      false
    )
  },
  methods: {
    iframeLoad() {
      var ifm = document.getElementById('iframe')
      ifm.height = document.documentElement.clientHeight
    },
  },
}
</script>
<style>
.abow_dialog {
  display: flex;
  justify-content: center;
  align-items: Center;
  overflow: hidden;
}
.abow_dialog .el-dialog {
  margin: 0 auto !important;
  height: 90%;
  overflow: hidden;
}
.abow_dialog .el-dialog__body {
  position: absolute;
  left: 0;
  top: 54px;
  bottom: 0;
  right: 0;
  padding: 0;
  z-index: 1;
  overflow: hidden;
  overflow-y: auto;
}
</style>

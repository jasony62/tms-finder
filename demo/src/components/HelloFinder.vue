<template>
  <div class="hello">
    <el-button type="text" @click="dialogVisible = true">打开tms-finder选择文件</el-button>
    <div>返回结果：{{returnData}}</div>
    <el-dialog class="abow_dialog" title="双击选择返回结果" :visible.sync="dialogVisible" width="90%" top="4vh">
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
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data() {
    return {
      dialogVisible: false,
      url: 'http://localhost:8080/finder_ue/web/storage',
      returnData: ''
    }
  },
  created() {
    window.addEventListener(
      'message',
      e => {
        const origin = event.origin || event.originalEvent.origin
        if (origin === 'http://localhost:8080') {
          this.returnData = e.data
          this.dialogVisible = false
        }
      },
      false
    )
  },
  methods: {
    iframeLoad(){
      var ifm = document.getElementById("iframe"); 
      ifm.height = document.documentElement.clientHeight;
    }
  }
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

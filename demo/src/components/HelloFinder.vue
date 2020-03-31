<template>
  <div class="hello">
    <el-button type="text" @click="dialogVisible = true">打开tms-finder选择文件</el-button>
    <div>返回结果：{{returnData}}</div>
    <el-dialog title="双击选择返回结果" :visible.sync="dialogVisible" width="90%">
      <div>
        <iframe
          width="100%"
          height="100%"
          frameborder="0"
          :src="url"
          marginwidth="0"
          marginheight="0"
          scrolling="no"
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
      url: 'http://localhost:8080/web/storage?domain=download',
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
  }
}
</script>

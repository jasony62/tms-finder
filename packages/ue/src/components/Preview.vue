<template>
  <div id="preview">
    <el-dialog title="文件预览" :closeOnClickModal="false" v-model="dialogVisible" :fullscreen="true">
      <iframe
        id="iframe"
        width="100%"
        height="100%"
        frameborder="0"
        :src="fileurl"
        marginwidth="0"
        marginheight="0"
        scrolling="auto"
      ></iframe>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps({
  fileurl: String,
})

const dialogVisible = ref(true)
</script>

<style lang="scss">
#preview {
  .el-dialog.is-fullscreen {
    @apply flex flex-col;

    .el-dialog__body {
      @apply flex-grow overflow-auto;
    }
  }

  iframe {
    height: 100%;
  }
}
</style>

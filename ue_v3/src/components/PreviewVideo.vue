<template>
  <div id="preview">
    <el-dialog
      class="abow_dialog"
      title="文件预览"
      :closeOnClickModal="false"
      v-model="dialogVisible"
      width="90%"
      top="4vh"
    >
      <div>WebRTC mp4</div>
      <div>{{ fileurl }}</div>
      <div>
        <tms-janus-mp4 :server="server" :file="mp4File"></tms-janus-mp4>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import {ref} from 'vue'
  import { JANUS_SERVER } from '../tms-janus'
  import { TmsJanusMp4 } from 'tms-janus-play'
  const props = defineProps({
    fileurl: String,
    file: Object,
    domain: String,
    bucket: String,
  })
  const server = ref(JANUS_SERVER)
  const mp4File = ref('sine-8k-testsrc2-baseline31-gop10-10s.mp4')
</script>
<style lang="scss">
  #preview {
    .preview_dialog {
      display: flex;
      justify-content: center;
      align-items: Center;
      overflow: hidden;
      .el-dialog {
        @apply flex flex-col;

        .el-dialog__body {
          @apply flex-grow overflow-auto;
        }
      }
    }
  }
</style>
<template>
  <div id="preview">
    <el-dialog class="preview_dialog" title="文件预览" :closeOnClickModal="false" v-model="dialogVisible" width="320px"
      top="4vh">
      <div>{{ file.path }}</div>
      <div>
        <tms-janus-audio :server="server" :file="audioFile"></tms-janus-audio>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { JANUS_SERVER } from '../tms-janus'
//@ts-ignore
import { TmsJanusAudio } from 'tms-janus-play'

const props = defineProps({
  fileurl: String,
  file: Object as any,
  domain: String,
  bucket: String,
})
const dialogVisible = ref(false)
const server = ref(JANUS_SERVER)
const audioFile = ref('sine-8k-10s.mp3')
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
<template>
  <div id="preview">
    <el-dialog title="文件预览" :closeOnClickModal="false" v-model="dialogVisible" :fullscreen="true">
      <div class="flex flex-row gap-2 h-full" style="background-color:#efefef;">
        <div class="h-full flex-grow">
          <iframe id="iframe" width="100%" height="100%" frameborder="0" :src="fileurl" marginwidth="0" marginheight="0"
            scrolling="auto"></iframe>
        </div>
        <div class="w-1/4 h-full bg-white px-2">
          <div class="file-info flex flex-col gap-2">
            <div>文件名</div>
            <div>{{ file.name }}</div>
            <div>文件字节数</div>
            <div>{{ file.size }}</div>
            <div>文件地址</div>
            <div class="break-all">{{ fileurl }}</div>
            <div>缩略图地址</div>
            <div class="break-all">{{ thumburl }}</div>
            <div>缩略图节数</div>
            <div>{{ file.thumbSize }}</div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import utils from '@/utils';
import { ref } from 'vue'

const props = defineProps({
  file: { type: Object, required: true },
})

const fileurl = utils.getFileUrl(props.file)
const thumburl = utils.getThumbUrl(props.file)

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

  .file-info {
    >div {
      @apply p-1;
    }

    >div:nth-child(odd) {
      @apply bg-gray-200;
    }
  }
}
</style>

<template>
  <div id="preview">
    <el-dialog title="文件预览" :closeOnClickModal="false" v-model="dialogVisible" :fullscreen="true">
      <div class="flex flex-row gap-2 h-full" style="background-color:#efefef;">
        <div class="h-full flex-grow">
          <vue-office-excel :src="fileurl" style="height: 100%; width: 100%;" @rendered="renderedHandler"
            @error="errorHandler" />
        </div>
        <div class="w-1/4 h-full bg-white px-2">
          <div class="file-info flex flex-col gap-2">
            <div>文件名</div>
            <div>{{ file.name }}</div>
            <div>文件字节数</div>
            <div>{{ file.size }}</div>
            <div>文件地址</div>
            <div class="break-all">{{ fileurl }}</div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { TmsFile } from '@/types';
import utils from '@/utils';
import { PropType, ref } from 'vue'
import VueOfficeExcel from '@vue-office/excel'
import '@vue-office/excel/lib/index.css'

const props = defineProps({
  file: { type: Object as PropType<TmsFile>, required: true },
})

const fileurl = utils.getFileUrl(props.file)

const renderedHandler = () => {
  console.log("渲染完成")
}

const errorHandler = () => {
  console.log("渲染失败")
}

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

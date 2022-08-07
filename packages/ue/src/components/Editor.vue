<template>
  <div id="infoEditor">
    <el-dialog title="文件信息" destroy-on-close :fullscreen="true" :closeOnClickModal="false" v-model="dialogVisible"
      @close="dialogVisible = false">
      <div class="flex flex-row gap-4 h-full overflow-auto">
        <json-doc ref="$jde" class="w-1/3 h-full overflow-auto" :schema="schemas" :value="info"></json-doc>
        <div class="h-full w-1/3 flex flex-col gap-2 relative">
          <div class="absolute top-0 right-0">
            <el-button @click="preview">预览</el-button>
          </div>
          <div class="border-2 border-gray-300 rounded-md p-2 h-full w-full overflow-auto">
            <pre>{{ previewResult }}</pre>
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="onSubmit">提交</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import createBrowseApi from '@/apis/file/browse'
import { JsonDoc } from 'tms-vue3-ui'
import { DocAsArray } from 'tms-vue3-ui/dist/es/json-doc'
import 'tms-vue3-ui/dist/es/json-doc/style/tailwind.scss'
import { ref } from 'vue'
import emitter from '@/EventBus'

const props = defineProps({
  schemas: { type: Object, required: true },
  path: { type: String, required: true },
  info: { type: Object },
  domain: { type: String },
  bucket: { type: String },
})
const { schemas, path, info, domain, bucket } = props

const dialogVisible = ref(true)

const $jde = ref<{ editing: () => string, editDoc: DocAsArray } | null>(null)

const previewResult = ref('')

const preview = () => {
  previewResult.value = JSON.stringify($jde.value?.editing(), null, 2)
}

const onSubmit = () => {
  const newInfo = $jde.value?.editing()
  createBrowseApi.setInfo(path, newInfo, domain, bucket).then(() => {
    emitter.emit('onInfoSubmit', newInfo)
    dialogVisible.value = false
  })
}
</script>
<style lang="scss">
#infoEditor {

  .el-dialog.is-fullscreen {
    @apply flex flex-col;

    .el-dialog__body {
      @apply flex-grow overflow-auto;
    }
  }
}
</style>
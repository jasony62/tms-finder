<template>
  <div id="infoEditor">
    <el-dialog title="文件信息" destroy-on-close :closeOnClickModal="false" v-model="dialogVisible"
      @close="dialogVisible = false">
      <div class="h-full  w-full overflow-auto">
        <json-doc ref="$jde" :hideRootTitle="true" :hideRootDescription="true" :hideFieldDescription="true"
          :schema="schemas" :value="info"></json-doc>
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
<template>
  <el-dialog title="文件信息" :fullscreen="true" :closeOnClickModal="false" v-model="dialogVisible" @close="onClose">
    <json-doc ref="jsonDocEditor" :schema="schemas" :value="info"></json-doc>
  </el-dialog>
</template>

<script setup lang="ts">
import createBrowseApi from '@/apis/file/browse'
import { JsonDoc } from 'tms-vue3-ui'
import 'tms-vue3-ui/dist/es/json-doc/style/tailwind.scss'
import { ref } from 'vue'

const props = defineProps({
  schemas: { type: Object, required: true },
  path: { type: String, required: true },
  info: { type: Object },
  domain: { type: String, required: true },
  bucket: { type: String },
})

const { path, info, domain, bucket } = props

const dialogVisible = ref(true)

const onClose = () => {
  // this.$emit('onClose', this.info)
  // this.$destroy()
}
const onSubmit = (newInfo: any) => {
  createBrowseApi.setInfo(path, info, domain, bucket).then(() => {
    Object.assign(info, newInfo)
    onClose()
  })
}
</script>

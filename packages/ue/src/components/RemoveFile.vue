<template>
  <el-dialog title="删除文件" :closeOnClickModal="false" v-model="dialogVisible">
    <el-form :label-position="'left'" label-width="80px">
      <el-form-item label="文件名">
        <el-input v-model="filepath" disabled></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="submit" :disabled="!filepath">执行</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import { inject, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { dialogInjectionKey } from 'gitart-vue-dialog'
import facStore from '@/store'
import emitter from '@/EventBus.js'

const store = facStore()

const props = defineProps({
  filepath: { type: String, default: '' },
  domain: { type: String, default: '' },
  bucket: { type: String, default: '' }
})
const { filepath, domain, bucket } = props

const $dialog = inject(dialogInjectionKey)

const dialogVisible = ref(true)

const submit = () => {
  if (!filepath) return
  store.removeFile(filepath, domain, bucket).then((rst: string) => {
    if (rst == 'ok') {
      ElMessage({
        message: '文件删除成功！',
        type: 'success'
      })
      emitter.emit('removeFile', { path: filepath })
      setTimeout(() => {
        $dialog?.removeDialog('removefile')
      }, 100)
    } else {
      ElMessage({
        message: rst,
        type: 'warning'
      })
    }
  })
}
</script>
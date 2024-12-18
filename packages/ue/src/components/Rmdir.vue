<template>
  <el-dialog title="删除目录" :closeOnClickModal="false" v-model="dialogVisible">
    <el-form :label-position="'left'" label-width="80px">
      <el-form-item label="目录名">
        <el-input v-model="dir" disabled></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="submit" :disabled="!dir">执行</el-button>
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
  dir: { type: String, default: '' },
  domain: { type: String, default: '' },
  bucket: { type: String, default: '' }
})
const { dir, domain, bucket } = props

const $dialog = inject(dialogInjectionKey)

const dialogVisible = ref(true)

const submit = () => {
  if (!dir) return
  store.rmdir(dir, domain, bucket).then((rst: string) => {
    if (rst == 'ok') {
      ElMessage({
        message: '目录删除成功！',
        type: 'success'
      })
      emitter.emit('rmdir', { path: dir })
      $dialog?.removeDialog('rmdir')
    } else {
      ElMessage({
        message: rst,
        type: 'warning'
      })
    }
  })
}
</script>
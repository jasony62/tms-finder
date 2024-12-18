<template>
  <el-dialog title="新建目录" :closeOnClickModal="false" v-model="dialogVisible">
    <el-form :label-position="'left'" label-width="80px">
      <el-form-item label="目录名">
        <el-input ref="elDirName" type="text" placeholder="请输入目录名" v-model="dirName" @input="validateDirName">
        </el-input>
        <div>父目录：{{ dir.path }}</div>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="submitMkdir" :disabled="!dirName">提交</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, inject } from 'vue'
import { ElMessage } from 'element-plus'
import facStore from '@/store'
import emitter from '@/EventBus.js'
import { dialogInjectionKey } from 'gitart-vue-dialog'

const $dialog = inject(dialogInjectionKey)
const dialogVisible = ref(true)

const props = defineProps({
  domain: { type: String, default: '' },
  bucket: { type: String, default: '' }
})
const { domain, bucket } = props

const store = facStore()

const elDirName = ref<any>(null)
const dirName = ref('')

const dir = computed(() => store.currentDir)

const validateDirName = (v: string) => dirName.value = v.replace(/\//g, '')

const submitMkdir = () => {
  if (dirName.value) {
    let fullname = dir.value ? dir.value.path + '/' : ''
    fullname += dirName.value
    store.mkdir(fullname, domain, bucket).then((rst: string) => {
      if (rst == 'ok') {
        ElMessage({
          message: '目录创建成功！',
          type: 'success'
        })
        emitter.emit('mkdir', { path: fullname, name: dirName.value })
        dialogVisible.value = false
        $dialog?.removeDialog('mkdir')
      } else {
        ElMessage({
          message: rst,
          type: 'warning'
        })
      }
    })
  }
}

onMounted(() => {
  nextTick(() => {
    elDirName.value?.focus()
  })
})
</script>
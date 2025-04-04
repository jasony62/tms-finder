<template>
  <el-dialog
    ref="el"
    :title="mode === 'create' ? '新建目录' : '修改目录'"
    v-model="dialogVisible"
    :destroy-on-close="destroyOnClose"
    :close-on-click-modal="false"
  >
    <el-form ref="form" :model="bucket" label-position="top">
      <el-form-item label="空间名称（英文字符）">
        <el-input v-model="bucket.name"></el-input>
      </el-form-item>
      <el-form-item label="空间显示名">
        <el-input v-model="bucket.title"></el-input>
      </el-form-item>
      <div class="h-full w-full overflow-auto" v-if="schemasRootName">
        <json-doc
          ref="$jde"
          :hideRootTitle="true"
          :hideRootDescription="true"
          :hideFieldDescription="true"
          :schema="schemas"
          :value="bucket[schemasRootName]"
        ></json-doc>
      </div>
      <el-form-item label="说明">
        <el-input type="textarea" v-model="bucket.description"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onSubmit">提交</el-button>
      <el-button @click="onBeforeClose">取消</el-button>
    </div>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, reactive, inject } from 'vue'
import apiBkt from '@/apis/bucket'
import { ElMessage } from 'element-plus'
import { dialogInjectionKey } from 'gitart-vue-dialog'
import { JsonDoc } from 'tms-vue3-ui'
import { DocAsArray } from 'tms-vue3-ui/dist/es/json-doc'

const $dialog = inject(dialogInjectionKey)

const props = defineProps({
  dialogVisible: { default: true },
  mode: { type: String, default: '' },
  bucket: {
    type: Object,
    default: function () {
      return { name: '', title: '', description: '' }
    },
  },
  onClose: { type: Function, default: (newDb: any) => {} },
  schemas: { type: Object, required: true },
  schemasRootName: { type: String, required: true },
})
const el = ref(null as unknown as Element)
const { mode, onClose } = props
const dialogVisible = ref(true)
const bucket = reactive(props.bucket)
const destroyOnClose = ref(false)

const $jde = ref<{ editing: () => string; editDoc: DocAsArray } | null>(null)

const onSubmit = () => {
  const extAttrs = $jde.value?.editing()
  bucket[props.schemasRootName] = extAttrs
  if (mode === 'update') {
    apiBkt
      .update(bucket.name, bucket)
      .then((newBucket: any) => {
        ElMessage({ message: '更新成功', type: 'success' })
        onBeforeClose(newBucket)
      })
      .catch((err: any) => {
        ElMessage({ message: err.msg || '失败', type: 'error' })
      })
  } else if (mode === 'create') {
    apiBkt
      .create(bucket)
      .then((newBucket: any) => {
        ElMessage({ message: '创建成功', type: 'success' })
        onBeforeClose(newBucket)
      })
      .catch((err: any) => {
        ElMessage({ message: err.msg || '失败', type: 'error' })
      })
  }
}
// 关闭对话框时执行指定的回调方法
const closeDialog = (newBucket?: any) => {
  onClose(newBucket)
}

// 对话框关闭前触发
const onBeforeClose = (newBucket?: any) => {
  closeDialog(newBucket)
  dialogVisible.value = false
  $dialog?.removeDialog('bucket')
}
</script>

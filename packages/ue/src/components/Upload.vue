<template>
  <el-dialog title="文件上传" :closeOnClickModal="false" v-model="dialogVisible" @close="dialogVisible = false">
    <el-form :label-position="'left'" label-width="80px">
      <el-form-item label="当前目录">
        <div>{{ dir }}</div>
      </el-form-item>
      <el-form-item label="上传文件">
        <el-upload ref="upload" :action="''" :http-request="handleUpload" :on-preview="handlePreview"
          :on-remove="handleRemove" :file-list="fileList" :auto-upload="false">
          <el-button slot="trigger" type="primary">选取文件</el-button>
        </el-upload>
      </el-form-item>
      <div v-if="schemas">
        <json-doc ref="$jde" class="w-full el-form-item" :schema="schemas" :value="info"></json-doc>
      </div>
      <el-form-item>
        <el-button style="margin-left: 10px;" type="success" :loading="showLoading" @click="submitUpload">
          提交</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'
import facStore from '@/store'
import createBrowseApi from '@/apis/file/browse'
import createUploadApi from '../apis/file/upload'
import { dialogInjectionKey } from 'gitart-vue-dialog'
import { JsonDoc } from 'tms-vue3-ui'
import { DocAsArray } from 'tms-vue3-ui/dist/es/json-doc'
import 'tms-vue3-ui/dist/es/json-doc/style/tailwind.scss'

const store = facStore()
const $dialog = inject(dialogInjectionKey)
const props = defineProps({
  dir: {
    type: String,
    default: ''
  },
  domain: String,
  bucket: String,
  schemas: { type: Object, required: false }
})
const { dir, domain, bucket, schemas } = props;
const info = ref({});
const fileList = ref([]);
const showLoading = ref(false);
const dialogVisible = ref(true);
const upload = ref<any>(null)
const $jde = ref<{ editing: () => string, editDoc: DocAsArray } | null>(null)

const handleUpload = (req: any) => {
  showLoading.value = true
  const fileData = new FormData()
  /**文件*/
  fileData.append('file', req.file)

  const headers = { 'Content-Type': 'multipart/form-data' }
  const config = {
    headers,
    onUploadProgress: (progressEvent: any) => {
      const percentCompleted = Math.floor(
        (progressEvent.loaded * 100) / progressEvent.total
      )
      req.onProgress({ percent: percentCompleted })
    }
  }
  createUploadApi.plain({ dir: dir, domain: domain, bucket: bucket }, fileData, config)
    .then(({ path }: { path: any }) => {
      req.onSuccess(path);
      /**自定义文件扩展信息*/
      const newInfo = $jde.value?.editing()
      createBrowseApi.setInfo(path, newInfo, domain, bucket).then(() => {
        store.list({ path: dir }, domain, bucket).then(() => {
          showLoading.value = false
          $dialog?.removeDialog(0)
        }).catch((err: any) => {
          showLoading.value = false
          $dialog?.removeDialog(0)
          req.onError(err)
        })
      })
    })
}
const submitUpload = () => {
  upload.value?.submit()
  // $dialog.removeDialog(0)
}
const handleRemove = () => { }
const handlePreview = () => { }
</script>

<style lang="scss">
.w-full.tvu-jdoc__root {

  .tvu-jdoc__field {
    flex-direction: row;

    .tvu-jdoc__field-label {
      width: 80px;
    }
  }
}
</style>
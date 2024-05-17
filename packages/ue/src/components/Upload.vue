<template>
  <el-dialog title="文件上传" :closeOnClickModal="false" v-model="dialogVisible" @close="dialogVisible = false">
    <el-form :label-position="'left'" label-width="80px">
      <el-form-item label="指定目录">
        <el-input placeholder="文件目录" v-model="targetDir"></el-input>
      </el-form-item>
      <el-form-item label="上传文件">
        <el-upload ref="upload" :action="''" :accept="UploadFileAccept" :on-change="handleChange"
          :http-request="handleUpload" :file-list="fileList" :auto-upload="false">
          <el-button slot="trigger" type="primary">选取文件</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="指定名称">
        <el-input placeholder="指定文件名称" v-model="assignedName"></el-input>
      </el-form-item>
      <el-form-item label="扩展属性" v-if="schemas">
        <div class="w-full">
          <json-doc ref="$jde" :hideRootTitle="true" :hideRootDescription="true" :hideFieldDescription="true"
            :schema="schemas" :value="info"></json-doc>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="success" :loading="showLoading" @click="submitUpload">
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
import { UploadFile } from 'element-plus'

import { UPLOAD_FILE_ACCEPT } from '@/global'

const UploadFileAccept = UPLOAD_FILE_ACCEPT()
const store = facStore()
const $dialog = inject(dialogInjectionKey)
const props = defineProps({
  dir: {
    type: String,
    default: '',
  },
  domain: String,
  bucket: String,
  schemas: { type: Object, required: false },
})
const { dir, domain, bucket, schemas } = props
const targetDir = ref(dir)
const assignedName = ref('')
const info = ref({})
const fileList = ref([])
const showLoading = ref(false)
const dialogVisible = ref(true)
const upload = ref<any>(null)
const $jde = ref<{ editing: () => string; editDoc: DocAsArray } | null>(null)

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
    },
  }
  createUploadApi
    .plain({ dir: targetDir.value, domain: domain, bucket: bucket, name: assignedName.value }, fileData, config)
    .then(({ path }: { path: any }) => {
      req.onSuccess(path)
      /**自定义文件扩展信息*/
      if (schemas) {
        const newInfo = $jde.value?.editing()
        createBrowseApi.setInfo(path, newInfo, domain, bucket).then(() => {
          store
            .list({ path: dir }, domain, bucket)
            .then(() => {
              showLoading.value = false
              $dialog?.removeDialog(0)
            })
            .catch((err: any) => {
              showLoading.value = false
              $dialog?.removeDialog(0)
              req.onError(err)
            })
        })
      } else {
        store.list({ path: dir }, domain, bucket).then(() => {
          showLoading.value = false
          $dialog?.removeDialog(0)
        })
      }
    })
}
const submitUpload = () => {
  upload.value?.submit()
  // $dialog.removeDialog(0)
}
const handleChange = (uploadFile: UploadFile) => {
  assignedName.value = uploadFile.name
}
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

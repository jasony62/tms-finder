<template>
  <el-dialog title="文件上传" :closeOnClickModal="false" v-model="dialogVisible">
    <el-form :label-position="'left'" label-width="80px">
      <el-form-item label="当前目录">
        <div>{{ dir }}</div>
      </el-form-item>
      <el-form-item label="上传文件">
        <el-upload ref="upload" :data="info" :action="''" :http-request="handleUpload" :on-preview="handlePreview"
          :on-remove="handleRemove" :file-list="fileList" :auto-upload="false">
          <el-button slot="trigger" type="primary">选取文件</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="补充说明">
        <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="info.comment"></el-input>
      </el-form-item>
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
import createUploadApi from '../apis/file/upload'
import { dialogInjectionKey } from 'gitart-vue-dialog'
import { SCHEMAS_ROOT_NAME } from '@/global';

const store = facStore()
const $dialog = inject(dialogInjectionKey)
const props = defineProps({
  dir: {
    type: String,
    default: ''
  },
  domain: String,
  bucket: String
})
const { dir, domain, bucket } = props;
const info = ref({ comment: '' });
const fileList = ref([]);
const showLoading = ref(false);
const dialogVisible = ref(true);
const upload = ref<any>(null)

const handleUpload = (req: any) => {
  showLoading.value = true
  const fileData = new FormData()
  /**自定义文件扩展信息*/
  if (req.data && Object.keys(req.data).length) {
    if (SCHEMAS_ROOT_NAME()) {
      fileData.append(SCHEMAS_ROOT_NAME(), new Blob([JSON.stringify(req.data)], { type: 'application/json' }))
    } else {
      Object.keys(req.data).forEach(key => {
        fileData.append(key, req.data[key])
      })
    }
  }
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
      store.list({ path: dir }, domain, bucket).then(() => {
        showLoading.value = false
      }).catch((err: any) => {
        showLoading.value = false
        req.onError(err)
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
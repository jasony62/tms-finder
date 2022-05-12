<template>
  <el-dialog title="文件上传" :closeOnClickModal="false" :visible="true" @close="onClose">
    <el-form :label-position="'left'" label-width="80px">
      <el-form-item label="当前目录">
        <div>{{ dir }}</div>
      </el-form-item>
      <el-form-item label="上传文件">
        <el-upload ref="upload" :data="info" :action="''" :http-request="handleUpload" :on-preview="handlePreview"
          :on-remove="handleRemove" :file-list="fileList" :auto-upload="false">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="补充说明">
        <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="info.comment"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button style="margin-left: 10px;" size="small" type="success" :loading="showLoading" @click="submitUpload">
          提交</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
  import { ref, onMounted, onBeforeUnmount } from 'vue'
  import facStore from '@/store'
  import createUploadApi from '../apis/file/upload'
  import { ElDialog, ElForm, ElFormItem, ElInput, ElUpload, ElButton } from 'element-plus'
  const store = facStore()
  const props = defineProps({
    tmsAxiosName: {
      type: String,
      default: 'file-api'
    },
    dir: {
      type: String,
      default: ''
    },
    domain: String,
    bucket: String
  })
  const { dir, domain, bucket, tmsAxiosName } = props;
  const info = ref({comment: ''});
  const fileList = ref([]);
  const showLoading = ref(false);
  const upload = ref(null)
  const handleUpload = (req: any) => {
    showLoading.value = true
    const fileData = new FormData();
    ['name', 'lastModified', 'size', 'type'].forEach(key => {
      fileData.append(key, req.file[key])
    })
    if (req.data) {
      Object.keys(req.data).forEach(key => {
        fileData.append(key, req.data[key])
      })
    }
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
      .then(({ path }) => {
        req.onSuccess(path);
        store.list({path: dir}, domain, bucket).then(() => {
          showLoading.value = false
          onClose()
      }).catch((err: any) => {
          showLoading.value = false
          req.onError(err)
        })
      })
  }
  const submitUpload = () => {
    console.log(upload);
    upload?.value.submit()
  }
  const handleRemove = () => { }
  const chandlePreview = () => { }
  const onClose = () => {
    // this.$destroy()
  }
</script>
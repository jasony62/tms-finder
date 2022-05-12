<template>
  <el-dialog title="删除目录" :closeOnClickModal="false" :visible="true" @close="onClose">
    <el-form :label-position="'left'" label-width="80px">
      <el-form-item label="目录名">
        <el-input v-model="dir"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitMkdir">提交</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
  import { ref, onMounted, onBeforeUnmount } from 'vue'
  import { TmsAxios } from 'tms-vue3'
  import createUploadApi from '../apis/file/upload'
  import { ElDialog, ElForm, ElFormItem, ElInput, ElButton, ElMessage } from 'element-plus'
  const props = defineProps({
    tmsAxiosName: {
      type: String,
      default: 'file-api'
    },
    dir: {
      type: String,
      default: '21212'
    },
    domain: String,
    bucket: String
  })
  const {dir, domain, bucket, tmsAxiosName} = props
  const submitMkdir = () => {
    if (dir) {
      createUploadApi.rmdir({ dir: dir, domain: domain, bucket: bucket })
        .then((res:any)=>{
          if (res=='ok') {
            ElMessage({
              message: '目录删除成功！',
              type: 'success'
            });
          }
          onClose()
        })
    }
  }
  const onClose = () => {
    // this.$destroy()
  }
</script>
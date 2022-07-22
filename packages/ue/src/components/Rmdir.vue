<template>
  <el-dialog title="删除目录" :closeOnClickModal="false" v-model="dialogVisible">
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
  import {inject, ref} from 'vue'
  import createUploadApi from '../apis/file/upload'
  import { ElMessage } from 'element-plus'
  import { dialogInjectionKey } from 'gitart-vue-dialog'
  const $dialog = inject(dialogInjectionKey)
  const props = defineProps({
    dir: {
      type: String,
      default: '21212'
    },
    domain: String,
    bucket: String
  })
  const {dir, domain, bucket} = props
  const dialogVisible  = ref(true)
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
          $dialog.removeDialog(0)
        })
    }
  }
</script>
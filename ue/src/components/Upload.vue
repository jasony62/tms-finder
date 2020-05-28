<template>
  <el-dialog title="文件上传" :closeOnClickModal="false" :visible="true" @close="onClose">
    <el-form :label-position="'left'" label-width="80px">
      <el-form-item label="当前目录">
        <div>{{dir}}</div>
      </el-form-item>
      <el-form-item label="上传文件">
        <el-upload
          ref="upload"
          :data="info"
          :action="''"
          :http-request="handleUpload"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="fileList"
          :auto-upload="false"
        >
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="补充说明">
        <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="info.comment"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button style="margin-left: 10px;" size="small" type="success" :loading="showLoading" @click="submitUpload">提交</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import store from '@/store'
import createUploadApi from '../apis/file/upload'
import { Dialog, Form, FormItem, Input, Upload, Button } from 'element-ui'

const componentOptions = {
  components: {
    'el-dialog': Dialog,
    'el-form': Form,
    'el-form-item': FormItem,
    'el-input': Input,
    'el-upload': Upload,
    'el-button': Button
  },
  props: {
    tmsAxiosName: String,
    dir: {
      type: String,
      default: ''
    },
    domain: String,
    bucket: String
  },
  data() {
    return {
      info: {
        comment: ''
      },
      fileList: [],
      showLoading: false
    }
  },
  mounted() {
    document.body.appendChild(this.$el)
  },
  beforeDestroy() {
    document.body.removeChild(this.$el)
  },
  methods: {
    handleUpload(req) {
      this.showLoading = true
      const fileData = new FormData()
      ;['name', 'lastModified', 'size', 'type'].forEach(key => {
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
        onUploadProgress: progressEvent => {
          const percentCompleted = Math.floor(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          req.onProgress({ percent: percentCompleted })
        }
      }
      createUploadApi(this.TmsAxios(this.tmsAxiosName))
        .plain(
          { dir: this.dir, domain: this.domain, bucket: this.bucket },
          fileData,
          config
        )
        .then(path => {
          req.onSuccess(path)
          store.dispatch('list', { dir: {path: this.dir}, domain: this.domain, bucket: this.bucket }).then(()=>{
            this.showLoading = false
            this.onClose()
          })
        })
        .catch(err => {
          this.showLoading = false
          req.onError(err)
        })
    },
    submitUpload() {
      this.$refs.upload.submit()
    },
    handleRemove() {},
    handlePreview() {},
    onClose() {
      this.$destroy()
    }
  }
}

export default componentOptions

export function createAndMount(Vue, props) {
  const CompClass = Vue.extend(componentOptions)

  const propsData = {
    tmsAxiosName: 'file-api'
  }
  if (props && typeof props === 'object') Object.assign(propsData, props)

  new CompClass({
    propsData
  }).$mount()
}
</script>
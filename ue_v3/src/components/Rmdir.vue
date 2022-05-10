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

<script>

import createUploadApi from '../apis/file/upload'
import { Dialog, Form, FormItem, Input, Button, Message } from 'element-ui'

const componentOptions = {
  components: {
    'el-dialog': Dialog,
    'el-form': Form,
    'el-form-item': FormItem,
    'el-input': Input,
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
    return {}
  },
  mounted() {
    document.body.appendChild(this.$el)
  },
  beforeDestroy() {
    document.body.removeChild(this.$el)
  },
  methods: {
    submitMkdir() {
      if (this.dir) {
        createUploadApi(this.TmsAxios(this.tmsAxiosName))
          .rmdir({ dir: this.dir, domain: this.domain, bucket: this.bucket })
          .then(res=>{
            if (res=='ok') {
              Message({
                message: '目录删除成功！',
                type: 'success'
              });
            }
          this.$tmsEmit('onRemove')
          this.onClose()
        })
      }
    },
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
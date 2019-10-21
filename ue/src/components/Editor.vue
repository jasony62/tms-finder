<template>
  <el-dialog title="文件信息" :visible="dialogVisible" @close="onClose">
    <tms-form :schemas="schemas" :data="file.info"></tms-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onSubmit">取消</el-button>
      <el-button type="primary" @click="onSubmit">保存修改</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Vue from 'vue'
import { Dialog, Button } from 'element-ui'
Vue.use(Dialog).use(Button)

import { TmsForm } from 'tms-form-vant'

import browser from '../apis/file/browse'

export default {
  components: { TmsForm },
  props: {
    schemas: { type: Array },
    file: { type: Object }
  },
  data() {
    return {
      dialogVisible: false
    }
  },
  created() {
    this.$on('open', function() {
      this.dialogVisible = true
    })
  },
  methods: {
    onClose() {
      this.dialogVisible = false
    },
    onSubmit() {
      browser.setInfo(this.file.path, this.file.info).then(schemas => {
        this.onClose()
      })
    }
  }
}
</script>
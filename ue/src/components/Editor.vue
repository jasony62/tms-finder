<template>
  <el-dialog
    title="文件信息"
    :closeOnClickModal="closeOnClickModal"
    :visible="dialogVisible"
    @close="onClose"
  >
    <el-json-doc :schema="schemas" :doc="file.info" v-on:submit="onSubmit"></el-json-doc>
  </el-dialog>
</template>

<script>
import Vue from 'vue'
import { Dialog } from 'element-ui'
import { ElJsonDoc } from 'tms-vue-ui'

Vue.use(Dialog)

import browser from '../apis/file/browse'

export default {
  components: { ElJsonDoc },
  props: {
    schemas: { type: Object },
    file: { type: Object }
  },
  data() {
    return {
      closeOnClickModal: false,
      dialogVisible: false
    }
  },
  created() {
    this.$on('open', () => {
      this.dialogVisible = true
    })
  },
  methods: {
    onClose() {
      this.dialogVisible = false
    },
    onSubmit(info) {
      browser.setInfo(this.file.path, info).then(() => this.onClose())
    }
  }
}
</script>
<template>
  <el-dialog title="文件信息" :closeOnClickModal="false" :visible="true" @close="onClose">
    <el-json-doc :schema="schemas" :doc="info" v-on:submit="onSubmit"></el-json-doc>
  </el-dialog>
</template>

<script>
import createBrowseApi from '../apis/file/browse'
import { Dialog } from 'element-ui'
import { ElJsonDoc } from 'tms-vue-ui'

const componentOptions = {
  components: { 'el-dialog': Dialog, ElJsonDoc },
  props: {
    tmsAxiosName: { type: String },
    schemas: { type: Object },
    path: { type: String },
    info: { type: Object },
    domain: String,
    bucket: String
  },
  mounted() {
    document.body.appendChild(this.$el)
  },
  beforeDestroy() {
    document.body.removeChild(this.$el)
  },
  methods: {
    onClose() {
      this.$emit('onClose', this.info)
      this.$destroy()
    },
    onSubmit(info) {
      createBrowseApi(this.TmsAxios(this.tmsAxiosName))
        .setInfo(this.path, info, this.domain, this.bucket)
        .then(() => {
          Object.assign(this.info, info)
          this.onClose()
        })
    }
  }
}

export default componentOptions

export function createAndMount(Vue, schemas, path, info, domain, bucket) {
  const CompClass = Vue.extend(componentOptions)
  const comp = new CompClass({
    propsData: {
      tmsAxiosName: 'file-api',
      schemas,
      path,
      info,
      domain,
      bucket
    }
  })
  comp.$mount()
  return comp
}
</script>
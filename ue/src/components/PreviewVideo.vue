<template>
  <el-dialog
    class="abow_dialog"
    title="文件预览"
    :closeOnClickModal="false"
    :visible="true"
    @close="onClose"
    width="90%"
    top="4vh"
  >
    <div>WebRTC mp4</div>
    <div>{{ fileurl }}</div>
    <div>
      <tms-janus-mp4 :server="server" :file="mp4File"></tms-janus-mp4>
    </div>
  </el-dialog>
</template>

<script>
import { Dialog } from 'element-ui'
import { JANUS_SERVER as server } from '../lib/global'
import { TmsJanusMp4 } from 'tms-janus-play'

const componentOptions = {
  components: { 'el-dialog': Dialog, TmsJanusMp4 },
  props: {
    tmsAxiosName: { type: String },
    fileurl: String,
    file: Object,
    domain: String,
    bucket: String,
  },
  data() {
    return {
      server,
      mp4File: 'sine-8k-testsrc2-baseline31-gop10-10s.mp4',
    }
  },
  mounted() {
    document.body.appendChild(this.$el)
  },
  beforeDestroy() {
    document.body.removeChild(this.$el)
  },
  methods: {
    onClose() {
      this.$destroy()
    },
  },
}

export default componentOptions

export function createAndMount(Vue, props) {
  const CompClass = Vue.extend(componentOptions)

  const propsData = {
    tmsAxiosName: 'file-api',
  }
  if (props && typeof props === 'object') Object.assign(propsData, props)

  new CompClass({
    propsData,
  }).$mount()
}
</script>
<style lang="less">
.abow_dialog {
  display: flex;
  justify-content: center;
  align-items: Center;
  overflow: hidden;
  .el-dialog {
    margin: 0 auto !important;
    height: 90%;
    overflow: hidden;
  }
  .el-dialog__body {
    position: absolute;
    left: 0;
    top: 54px;
    bottom: 0;
    right: 0;
    padding: 0;
    z-index: 1;
    overflow: hidden;
  }
}
</style>
<template>
  <el-dialog
    class="preview_dialog"
    title="文件预览"
    :closeOnClickModal="false"
    :visible="true"
    @close="onClose"
    width="320px"
    top="4vh"
  >
    <div>{{ file.path }}</div>
    <div>
      <tms-janus-audio :server="server" :file="audioFile"></tms-janus-audio>
    </div>
  </el-dialog>
</template>

<script>
import { Dialog } from 'element-ui'
import { JANUS_SERVER as server } from '../tms-janus'
import { TmsJanusAudio } from 'tms-janus-play'

const componentOptions = {
  components: { 'el-dialog': Dialog, TmsJanusAudio },
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
      audioFile: 'sine-8k-10s.mp3',
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
.preview_dialog {
  display: flex;
  justify-content: center;
  align-items: Center;
  overflow: hidden;
  .el-dialog {
    margin: 0 auto !important;
    height: 240px;
    overflow: hidden;
  }
  .el-dialog__body {
    position: absolute;
    left: 0;
    top: 54px;
    bottom: 0;
    right: 0;
    padding: 10px 20px;
    z-index: 1;
    overflow: hidden;
  }
}
</style>
<template>
  <div class="plugins">
    <div v-for="p in plugins" :key="p.name" @click="handlePlugin(p)">
      <el-button type="success">{{ p.title }} </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import pluginApi from '@/apis/plugin.js'
import facStore from '@/store'

const props = defineProps({
  domain: {
    type: String,
    default: () => {
      return ''
    },
  },
  bucket: {
    type: String,
    default: () => {
      return ''
    },
  },
  handlePlugin: { type: Function },
})

const plugins = ref<any[]>([])

const store = facStore()

const handlePlugin = (plugin: any) => {
  if (props.handlePlugin)
    props.handlePlugin(plugin, { dir: store.currentDir.path })
}

onMounted(async () => {
  pluginApi.list(props.domain, props.bucket, 'dir').then((data: any) => {
    plugins.value.push(...data)
  })
})
</script>

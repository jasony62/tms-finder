<template>
  <div class="topbar flex flex-row gap-2">
    <div v-if="SupportMultiView" class="w-1/5">
      <el-radio-group v-model="manageOrStorage" @change="toggleRoute(manageOrStorage)">
        <el-radio-button label="manage">管理视图</el-radio-button>
        <el-radio-button label="storage">存储视图</el-radio-button>
      </el-radio-group>
    </div>
    <div class="w-1/5 flex flex-row items-center">
      <el-radio-group v-model="store.viewStyle" @change="selectViewStyle">
        <el-radio-button label="1">列表视图</el-radio-button>
        <el-radio-button label="2">图标视图</el-radio-button>
      </el-radio-group>
    </div>
    <div class="flex-grow flex flex-row gap-2 items-center">
      <div style="min-width: 20rem;" v-if="manageOrStorage === 'storage'">
        当前目录：
        <span v-if="store.currentDir">{{ store.currentDir.path }}</span>
      </div>
      <el-button @click.prevent="mkdir" v-if="manageOrStorage === 'storage'">新建目录</el-button>
      <el-button @click.prevent="rmdir" v-if="manageOrStorage === 'storage'">删除目录</el-button>
      <el-button @click.prevent="upload">上传文件</el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, inject, onMounted, ref } from 'vue';
import { dialogInjectionKey } from 'gitart-vue-dialog'
import facStore from '@/store'
import Rmdir from './Rmdir.vue'
import Upload from './Upload.vue'
import Mkdir from './Mkdir.vue'
import { useRouter, useRoute } from 'vue-router';
import { SUPPORT_MULTI_VIEW } from '@/global';
const props = defineProps({
  activeIndex: { type: String },
  domain: { type: String },
  bucket: { type: String }
})
const { activeIndex, domain, bucket } = props
const $dialog = inject(dialogInjectionKey)

const store = facStore()

const SupportMultiView = ref(false)

const router = useRouter()
const route = useRoute()

const manageOrStorage = ref(activeIndex || 'storage')

const selectViewStyle = (value: string) => {
  store.setViewStyle(value)
}

const toggleRoute = (name: string) => {
  router.push({ name, query: route.query })
}

const currentDir = computed(() => {
  return store.currentDir
})

const upload = () => {
  $dialog?.addDialog({
    component: Upload, props: {
      dir: currentDir.value ? currentDir.value.path : null,
      domain: domain,
      bucket: bucket
    }
  })
}

const mkdir = () => {
  $dialog?.addDialog({
    component: Mkdir, props: {
      dir: currentDir ? currentDir.value.path : null,
      bucket: bucket
    }
  })
}
const rmdir = () => {
  $dialog?.addDialog({
    component: Rmdir, props: {
      dir: currentDir ? currentDir.value.path : null,
      domain: domain,
      bucket: bucket
    }
  })
}
onMounted(() => {
  SupportMultiView.value = SUPPORT_MULTI_VIEW()
})
</script>
<style scoped>
</style>
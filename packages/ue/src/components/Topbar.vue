<template>
  <div class="topbar flex flex-row gap-2">
    <div v-if="SupportMultiView" class="w-1/5">
      <el-radio-group
        v-model="manageOrStorage"
        @change="toggleRoute(manageOrStorage)"
      >
        <el-radio-button value="manage">管理视图</el-radio-button>
        <el-radio-button value="storage">存储视图</el-radio-button>
      </el-radio-group>
    </div>
    <div v-if="SupportThumbnail" class="w-1/5 flex flex-row items-center">
      <el-radio-group v-model="store.viewStyle" @change="selectViewStyle">
        <el-radio-button value="1">列表视图</el-radio-button>
        <el-radio-button value="2">图标视图</el-radio-button>
      </el-radio-group>
    </div>
    <div class="flex-grow flex flex-row gap-2 items-center">
      <div style="min-width: 20rem" v-if="manageOrStorage === 'storage'">
        当前目录：
        <span v-if="store.currentDir">{{ store.currentDir.path }}</span>
      </div>
      <el-button
        @click.prevent="mkdir"
        v-if="manageOrStorage === 'storage'"
        :disabled="!currentDir"
        >新建目录</el-button
      >
      <el-button
        @click.prevent="rmdir"
        v-if="manageOrStorage === 'storage'"
        :disabled="!currentDir || !currentDir.path"
      >
        删除目录
      </el-button>
      <el-button @click.prevent="upload">上传文件</el-button>
    </div>
    <div v-if="SupportBucketMode">
      <el-dropdown split-button type="default">
        {{ bucketObj.title || bucketObj.name }}
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="toggleRoute('bucket')"
              >切换空间</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, inject, onMounted, ref, toRaw } from 'vue'
import { dialogInjectionKey } from 'gitart-vue-dialog'
import facStore from '../store'
import Rmdir from './Rmdir.vue'
import Upload from './Upload.vue'
import Mkdir from './Mkdir.vue'
import { useRouter, useRoute } from 'vue-router'
import { BUCKET_MODE, SUPPORT_MULTI_VIEW, SUPPORT_THUMBNAIL } from '../global'
import apiBucket from '../apis/bucket.js'

const props = defineProps({
  activeIndex: { type: String },
  domain: { type: String },
  bucket: { type: String },
})
const { activeIndex, domain, bucket } = props
const $dialog = inject(dialogInjectionKey)

const store = facStore()

const SupportMultiView = ref(false)
const SupportThumbnail = ref(false)

const router = useRouter()
const route = useRoute()

const manageOrStorage = ref(activeIndex || 'storage')

const schemas = computed(() => store.schemas)

const SupportBucketMode = BUCKET_MODE()

const selectViewStyle = (value: string) => {
  store.setViewStyle(value)
}

const toggleRoute = (name: string) => {
  router.push(name === 'bucket' ? { name } : { name, query: route.query })
}

const currentDir = computed(() => {
  return store.currentDir
})
/**
 * 空间对象
 */
const bucketObj = ref({ name: bucket, title: '' })

const upload = () => {
  let props: any = {
    dir: currentDir.value ? currentDir.value.path : null,
    domain: domain,
    bucket: bucket,
  }
  if (schemas) props.schemas = toRaw(schemas)
  $dialog?.addDialog({
    component: Upload,
    props,
    id: 'upload',
  })
}
const mkdir = () => {
  $dialog?.addDialog({
    component: Mkdir,
    props: {
      domain,
      bucket,
    },
    id: 'mkdir',
  })
}
const rmdir = () => {
  $dialog?.addDialog({
    component: Rmdir,
    props: {
      dir: currentDir ? currentDir.value.path : null,
      domain: domain,
      bucket: bucket,
    },
    id: 'rmdir',
  })
}
onMounted(() => {
  SupportMultiView.value = SUPPORT_MULTI_VIEW()
  SupportThumbnail.value = SUPPORT_THUMBNAIL()
  if (bucket) {
    apiBucket.byName(bucket).then((result: any) => {
      bucketObj.value = result
    })
  }
})
</script>
<style scoped></style>

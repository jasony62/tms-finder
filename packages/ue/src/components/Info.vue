<template>
  <div class="info">
    <el-table :data="files" stripe style="width: 100%" v-if="viewStyle == '1'">
      <el-table-column type="index" label="序号" width="64"></el-table-column>
      <el-table-column label="名称" key="name" prop="name"></el-table-column>
      <el-table-column v-if="schemas" v-for="(s, k) in schemas.properties" :key="k" :prop="columnPropName(k)"
        :label="s.title">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="260">
        <template #default="scope">
          <el-button size="small" @click="preview(scope.row)">预览</el-button>
          <el-button size="small" @click="setInfo(scope.row)" v-if="schemas">编辑</el-button>
          <el-button size="small" @click="download(scope.row)">下载</el-button>
          <el-button size="small" @click="pick(scope.row)" v-if="SupportPickFile">选取</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="icon-view" v-if="viewStyle == '2'">
      <div class="icon-lists" v-if="files.length">
        <el-card :class="cardClass" v-for="(item, index) in files" :key="index + '-only'"
          :body-style="{ padding: '0px' }" shadow="never">
          <svg class="icon" aria-hidden="true">
            <use :xlink:href="formateFileType(item)" />
          </svg>
          <div style="padding: 0 14px 14px">
            <span class="file-comment">{{ item.comment }}</span>
            <div class="bottom clearfix">
              <el-button @click="setInfo(item)" v-if="schemas">编辑</el-button>
              <el-button @click="download(item)">下载</el-button>
            </div>
          </div>
        </el-card>
        <div :class="emptyClass" v-for="index in columns - (files.length % columns)" :key="index"
          v-show="files.length % columns > 0"></div>
      </div>
      <div class="empty" v-else>暂无数据</div>
    </div>
    <el-pagination background v-model:currentPage="batch.page" :page-sizes="[10, 20, 30]" v-model:pageSize="batch.size"
      layout="total, sizes, prev, pager, next" :total="batch.total"></el-pagination>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, reactive, ref, toRaw, watch } from 'vue'
import { dialogInjectionKey } from 'gitart-vue-dialog'
import { Batch } from 'tms-vue3'
import facStore from '@/store'
import manageApi from '@/apis/file/manage'
import utils from '@/utils'
import emitter from '@/EventBus'
import Preview from './Preview.vue'
import Editor from './Editor.vue'
import { SCHEMAS_ROOT_NAME, SUPPORT_PICK_FILE } from '@/global'

const props = defineProps({
  domain: { type: String },
  bucket: { type: String },
})

const store = facStore()
const $dialog = inject(dialogInjectionKey)

const { domain, bucket } = props
const files = ref<any[]>([])

const batch = reactive(new Batch(manageApi.list, domain, bucket))
batch.page = 1
batch.size = 10

const columns = ref(9)
const cardClass = ref('el-card')
const emptyClass = ref('empty-card')

const SupportPickFile = ref(false)

const SchemasRootName = SCHEMAS_ROOT_NAME()
// 表格类对应的数据属性名称
const columnPropName = (key: any) => SchemasRootName ? (SchemasRootName + '.' + key) : key

const schemas = computed(() => store.schemas)

const viewStyle = computed(() => {
  return store.viewStyle
})

const batchList = (page: number) => {
  batch.goto(page).then((batchResult: any) => {
    files.value = batchResult.result.files
  })
}
/**编辑自定义扩展信息*/
const setInfo = (file: any) => {
  const props: any = { domain, bucket, schemas: toRaw(schemas), path: file.path }
  props.info = SchemasRootName ? (file[SchemasRootName] ?? {}) : file
  $dialog?.addDialog({
    component: Editor,
    props,
  })
  emitter.on('onInfoSubmit', (newInfo: any) => {
    if (SchemasRootName) file[SchemasRootName] = newInfo
    else Object.assign(file, newInfo)
    emitter.off('onInfoSubmit')
  })
}

const preview = (file: any) => {
  $dialog?.addDialog({ component: Preview, props: { file } })
}

const download = (file: any) => {
  // const fileurl = this.$utils.getFileUrl(file)
  // MessageBox.confirm(fileurl, file.name, {
  //   confirmButtonText: '下载',
  //   cancelButtonText: '取消'
  // }).then(() => {
  //   window.open(fileurl)
  // })
}

/**
 * 返回选取的文件
 * @param file 选取的文件 
 */
const pick = (file: any) => {
  utils.postFile(file, domain ?? '')
}

const formateFileType = (data: any) => {
  const fileType = utils.matchType(data.name)
  let iconId = ''
  switch (fileType) {
    case 'image':
      iconId = '#iconyunpanlogo-6'
      break
    case 'txt':
      iconId = '#iconyunpanlogo-5'
      break
    case 'excel':
      iconId = '#iconyunpanlogo-'
      break
    case 'word':
      iconId = '#iconyunpanlogo-2'
      break
    case 'pdf':
      iconId = '#iconyunpanlogo-7'
      break
    case 'ppt':
      iconId = '#iconyunpanlogo-1'
      break
    case 'video':
      iconId = '#iconyunpanlogo-4'
      break
    case 'viewStyle':
      iconId = '#iconyunpanlogo-3'
      break
    case 'other':
      iconId = '#iconicon_weizhiwenjian'
      break
    default:
      iconId = '#iconicon_weizhiwenjian'
      break
  }
  return iconId
}

onMounted(async () => {
  SupportPickFile.value = SUPPORT_PICK_FILE()
  if (window.screen.width >= 1920) {
    columns.value = 10
    cardClass.value = 'el-card-2'
    emptyClass.value = 'empty-card-2'
  } else {
    columns.value = 9
    cardClass.value = 'el-card'
    emptyClass.value = 'empty-card'
  }
  await store.getSchemas(bucket, domain)
  /**监听翻页*/
  watch(
    () => batch.page,
    (page) => {
      batchList(page)
    },
    { immediate: true }
  )
})
</script>
<style lang="scss">
.info {
  display: flex;
  flex-direction: column;

  .el-card {
    margin-bottom: 10px;
    width: 10%;
  }

  .empty-card {
    margin-bottom: 10px;
    width: 10%;
  }

  .el-card-2 {
    margin-bottom: 10px;
    width: 9%;
  }

  .empty-card-2 {
    margin-bottom: 10px;
    width: 9%;
  }

  .empty {
    width: 100%;
    margin-top: 50px;
    line-height: 60px;
    text-align: center;
    color: #909399;
    border-top: 1px solid #ebeef5;
    border-bottom: 1px solid #ebeef5;
    font-size: 14px;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
    margin-left: 6px;
  }
}
</style>

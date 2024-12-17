<template>
  <div class="files flex flex-col gap-2 h-full overflow-auto">
    <div class="flex flex-row gap-2 w-1/2" style="display:none;">
      <el-input placeholder="全站搜索-请输入文件名名称" v-model="searchContent"></el-input>
      <el-button type="primary" @click="overallSearch">搜索</el-button>
      <el-button type="primary" @click="drawer = true">执行插件</el-button>
    </div>
    <el-table ref="multipleTableRef" :data="files" stripe v-if="viewStyle === '1'">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" label="文件名"></el-table-column>
      <el-table-column prop="createTime" label="日期" width="180" :formatter="formatDate"></el-table-column>
      <el-table-column prop="size" label="大小" width="180" :formatter="formateFileSize"></el-table-column>
      <el-table-column fixed="right" label="操作" width="260">
        <template #default="scope">
          <el-button size="small" @click="preview(scope.row)">预览</el-button>
          <el-button size="small" @click="setInfo(scope.row)" v-if="schemas">编辑</el-button>
          <el-button size="small" @click="pick(scope.row)" v-if="SupportPickFile">选取
          </el-button>
          <el-button size="small" @click="remove(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="icon-view" v-if="viewStyle === '2'">
      <div class="icon-lists" v-if="files.length">
        <el-card :class="cardClass" v-for="(item, index) in files" :key="index" :body-style="{ padding: '0px' }"
          shadow="never">
          <div class="thumb">
            <img :src="thumbUrl(item)" @load="imgload(index)" @error="imgError" />
          </div>
          <svg class="image icon" aria-hidden="true">
            <use :xlink:href="formateFileType(item)" />
          </svg>
          <div class="file-info">
            <div class="file-name">{{ item.name }}</div>
            <div class="file-time-and-size">
              <div class="time">{{ formatDate(item) }}</div>
              <div class="file-size">{{ formateFileSize(item) }}</div>
            </div>
            <div class="operation">
              <el-button type="default" size="small" @click="preview(item)">预览</el-button>
              <el-button type="default" size="small" @click="setInfo(item)" v-if="schemas">编辑
              </el-button>
              <el-button type="default" size="small" @click="pick(item)" v-if="SupportPickFile">选取
              </el-button>
            </div>
          </div>
        </el-card>
        <div :class="emptyClass" v-for="index in columns - (files.length % columns)" :key="index + '-only'"
          v-show="files.length % columns > 0"></div>
      </div>
      <div class="empty" v-else>暂无数据</div>
    </div>
    <el-drawer v-model="drawer" title="I am the title" :with-header="false">
      <div v-for="p in pluginList" style="margin-top: 10px">
        <el-button v-if="p.transData === 'nothing'" type="success" plain @click="handlePlugin(p)">{{ p.title }}
        </el-button>
        <el-dropdown v-else>
          <el-button type="success" plain>{{ p.title }}<i class="el-icon-arrow-down el-icon--right"></i></el-button>
          <template #dropdown>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="handlePlugin(p, 'all')">按全部</el-dropdown-item>
              <el-dropdown-item @click.native="handlePlugin(p)">按选中</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-drawer>
  </div>
</template>
<script setup lang="ts">
import { computed, inject, onMounted, ref, toRaw } from 'vue'
import { dialogInjectionKey } from 'gitart-vue-dialog'
import facStore from '@/store'
import utils from '@/utils'
import emitter from '@/EventBus'
import Preview from './Preview.vue'
import PreviewDocx from './PreviewDocx.vue'
import PreviewXlsx from './PreviewXlsx.vue'
import PreviewPptx from './PreviewPptx.vue'
import Editor from './Editor.vue'
import { ElTable, ElMessage } from 'element-plus'
import apiPlugin from "@/apis/plugin";
import { SUPPORT_PICK_FILE } from '@/global'
import RemoveFile from './RemoveFile.vue'
import { TmsFile } from '@/types'

const SupportPickFile = ref(false)

const props = defineProps({
  domain: { type: String },
  bucket: { type: String },
})
const { domain, bucket } = props

const store = facStore()
const $dialog = inject(dialogInjectionKey)

const searchContent = ref('')
const columns = ref(5)
const cardClass = ref('el-card')
const emptyClass = ref('empty-card')

const schemas = computed(() => store.schemas)

const files = computed(() => {
  return store.files
})
const pluginList = ref<any[]>([]);

const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const viewStyle = computed(() => {
  return store.viewStyle
})

const imgload = (index: number) => {
  let card_body = document.getElementsByClassName('el-card__body')[index]
  //@ts-ignore
  card_body.children[1].style.display = 'none'
}
const imgError = (e: any) => {
  e.target.parentNode.style.display = 'none'
}
const preview = (file: TmsFile) => {
  // const fileType = utils.matchType(file.name)
  // // 是否配置了Janus媒体服务器
  // const isSupportJanus = /yes|true/i.test(
  //   process.env.VUE_APP_TMS_JANUS_SUPPORT
  // )
  // const { domain, bucket } = this
  // if (/excel|word|ppt|pdf/.test(fileType)) {
  //   window.open(fileurl)
  // } else if (isSupportJanus && /viewStyle/.test(fileType)) {
  //   import('./PreviewAudio.vue').then((Module) => {
  //     Module.createAndMount(Vue, {
  //       fileurl,
  //       file,
  //       domain,
  //       bucket,
  //     })
  //   })
  // } else if (isSupportJanus && /video/.test(fileType)) {
  //   import('./PreviewVideo.vue').then((Module) => {
  //     Module.createAndMount(Vue, {
  //       fileurl,
  //       domain,
  //       bucket,
  //     })
  //   })
  // } else {
  // import('./Preview.vue').then((Module) => {
  if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    $dialog?.addDialog({ component: PreviewDocx, props: { file } })
  } else if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    $dialog?.addDialog({ component: PreviewXlsx, props: { file } })
  } else if (file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
    $dialog?.addDialog({ component: PreviewPptx, props: { file } })
  } else
    $dialog?.addDialog({ component: Preview, props: { file } })
  // })
  // }
}

const SchemasRootName = computed(() => store.schemasRootName)
const setInfo = (file: any) => {
  const props: any = { domain, bucket, schemas: toRaw(schemas), path: file.path }
  props.info = SchemasRootName.value ? (file[SchemasRootName.value] ?? {}) : file
  $dialog?.addDialog({
    component: Editor,
    props
  })
  emitter.on('onInfoSubmit', (newInfo: any) => {
    if (SchemasRootName.value) file[SchemasRootName.value] = newInfo
    else Object.assign(file, newInfo)
    emitter.off('onInfoSubmit')
  })
}

const download = (index: number, file: any) => {
  // const fileurl = this.$utils.getFileUrl(file)
  // MessageBox.confirm(fileurl, file.name, {
  //   confirmButtonText: '下载',
  //   cancelButtonText: '取消',
  // }).then(() => {
  //   window.open(fileurl)
  // })
}
/**
 * 返回选取的文件
 * @param file 选取的文件 
 */
const pick = (file: TmsFile) => {
  utils.postFile(file, domain ?? '')
}
/**
 * 发起删除文件
 * @param file 
 */
const remove = (file: TmsFile) => {
  $dialog?.addDialog({
    component: RemoveFile, props: {
      filepath: file.path,
      domain: domain,
      bucket: bucket
    }
  })
}
/**
 * 完成删除文件
 */
emitter.on('removeFile', ({ path }) => {
  let index = store.files.findIndex(f => f.path === path)
  store.files.splice(index, 1)
})

// 全局搜索
const overallSearch = () => {
  // this.$store.dispatch({
  //   type: 'overallSearch',
  //   dir: '',
  //   basename: this.searchContent,
  // })
}
// 格式化日期
const formatDate = (file: any) => {
  // birthtime有可能是0
  const date = new Date(file.birthtime || file.mtime)
  return date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日'
}
// 格式化文件大小
const formateFileSize = (file: any) => {
  return fileLengthFormat(file.size, 1)
}
/**
 * @description 格式化文件大小
 * @params {number} total 文件大小，默认单位Byte
 * @params {number} n 1-b 2-kb 3-mb
 */
const fileLengthFormat = (total: number, n: number): string => {
  const size = total / 1024
  if (size > 1024) {
    return fileLengthFormat(size, ++n)
  } else {
    let format = size.toFixed(2)
    switch (n) {
      case 1:
        format += 'KB'
        break
      case 2:
        format += 'MB'
        break
      case 3:
        format += 'GB'
        break
      case 4:
        format += 'TB'
        break
    }
    return format
  }
}
// 文件类型对应图标
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
  }
  return iconId
}
const thumbUrl = (file: any) => {
  return utils.getThumbUrl(file)
}

onMounted(async () => {
  SupportPickFile.value = SUPPORT_PICK_FILE()

  if (window.screen.width >= 1920) {
    columns.value = 7
    cardClass.value = 'el-card-2'
    emptyClass.value = 'empty-card-2'
  } else {
    columns.value = 5
    cardClass.value = 'el-card'
    emptyClass.value = 'empty-card'
  }
  await store.getSchemas(bucket, domain)
  // 获取可使用插件
  // new Promise(resolve => {
  //   resolve([{ title: '测试fs', name: 'files' }])
  // }).then((res: any) => {
  //   pluginList.value.push(...res)
  // })
})
/*watch(files, async (newvalue, oldvalue) => {
  const suffix = newvalue.map(i => i.name.split('.')[1])
  const suffixSet = [...new Set(suffix)]
  try{
    const data = await apiPlugin.list(suffix.join(','))
    pluginList.value = data.result
  }catch (e) {
    console.log(e);
  }
})*/
const drawer = ref(false);
const handlePlugin = (plugin: any, filter?: string) => {
  // 调用接口执行插件内容
  const selectRows = multipleTableRef.value?.getSelectionRows();
  if (!filter && selectRows.length === 0) {
    ElMessage({
      message: '无选中的数据',
      type: 'warning',
    })
    return
  }
  const names = selectRows.map((i: any) => i.name)
  // 调用插件接口
  apiPlugin.execute({ names, pluginName: plugin.name, filter, dir: store.currentDir?.path }).then((res: any) => {
    const data = res.result;
    const msgs = data.map((i: any) => {
      return `文件名${i.filename}, 文件大小${i.size}`
    })
    alert(`插件执行完毕，执行结果\n${msgs.join('\n')}`)
    /*ElMessage({
      message: `插件执行完毕，执行结果${JSON.stringify(res.result)}`,
      type: 'info',
    })*/
  })
}
</script>
<style lang="scss">
.files {
  display: flex;
  flex-direction: column;

  .el-card {
    margin-bottom: 10px;
    width: 19%;
    height: 240px;

    .el-card__body {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .thumb {
      padding: 8px;
      @apply flex-grow flex flex-row justify-center;

      img {
        @apply object-contain h-full;
      }
    }
  }

  .empty-card {
    margin-bottom: 10px;
    width: 19%;
  }

  .el-card-2 {
    margin-bottom: 10px;
    width: 13%;
  }

  .empty-card-2 {
    margin-bottom: 10px;
    width: 13%;
  }

  .file-info {
    @apply p-2 flex flex-col gap-2;

    .file-name {
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 100%;
    }

    .file-time-and-size {
      @apply flex flex-row justify-between;

      .file-size,
      .time {
        font-size: 13px;
        color: #999;
      }
    }

    .operation {
      @apply flex flex-row;
    }
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


}

.icon-view .icon-lists {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  box-sizing: border-box;
}
</style>

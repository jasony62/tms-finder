<template>
  <div class="files flex flex-col gap-2">
    <div class="flex flex-row gap-2 w-1/2">
      <el-input placeholder="全站搜索-请输入文件名名称" v-model="searchContent"></el-input>
      <el-button type="primary" @click="overallSearch">搜索</el-button>
      <el-button type="primary" @click="drawer = true">执行插件</el-button>
    </div>
    <el-table ref="multipleTableRef" :data="files" stripe style="width: 100%" v-if="viewStyle === '1'">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="createTime" label="日期" width="180" :formatter="formatDate"></el-table-column>
      <el-table-column prop="size" label="大小" width="180" :formatter="formateFileSize"></el-table-column>
      <el-table-column prop="name" label="文件名"></el-table-column>
      <el-table-column fixed="right" label="操作" width="260">
        <template #default="scope">
          <el-button size="small" @click="preview(scope.row)">预览</el-button>
          <el-button size="small" @click="setInfo(scope.row)" v-if="schemas">编辑</el-button>
          <el-button size="small" @click="download(scope.$index, scope.row)">下载</el-button>
          <el-button size="small" @click="pick(scope.row)" v-if="SupportPickFile">选取
          </el-button>
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
          <div style="padding: 0 14px 14px">
            <span class="file-name">{{ item.name }}</span>
            <div class="bottom clearfix">
              <time class="time">{{ formatDate(item) }}</time>
              <span class="file-size">{{ formateFileSize(item) }}</span>
              <div class="operation">
                <el-button type="default" class="button" @click="preview(item)">预览</el-button>
                <el-button type="default" class="button" @click="setInfo(item)" v-if="schemas">编辑
                </el-button>
                <el-button type="default" class="button" @click="download(index, item)">下载</el-button>
                <el-button type="default" class="button" @click="pick(item)" v-if="SupportPickFile">选取
                </el-button>
              </div>
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
import Editor from './Editor.vue'
import { ElTable, ElMessage } from 'element-plus'
import apiPlugin from "@/apis/plugin";
import { SCHEMAS_ROOT_NAME, SUPPORT_PICK_FILE } from '@/global'

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
  card_body.children[0].style.display = 'block'
  //@ts-ignore
  card_body.children[1].style.display = 'none'
}
const imgError = (e: any) => {
  e.target.parentNode.style.display = 'none'
  e.target.parentNode.parentNode.children[1].style.display = 'block'
}
const preview = (file: any) => {
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
  $dialog?.addDialog({ component: Preview, props: { file } })
  // })
  // }
}

const SchemasRootName = SCHEMAS_ROOT_NAME()
const setInfo = (file: any) => {
  const props: any = { domain, bucket, schemas: toRaw(schemas), path: file.path }
  props.info = SchemasRootName ? (file[SchemasRootName] ?? {}) : file
  $dialog?.addDialog({
    component: Editor,
    props
  })
  emitter.on('onInfoSubmit', (newInfo: any) => {
    if (SchemasRootName) file[SchemasRootName] = newInfo
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
const pick = (file: any) => {
  let url = utils.getFileUrl(file)
  let thumbUrl = utils.getThumbUrl(file)
  let { name, type, size, thumbSize } = file
  let posted: any = { url, thumbUrl, name, type, size, thumbSize }
  if (SchemasRootName) posted[SchemasRootName] = file[SchemasRootName]
  utils.postMessage(() => posted)
}

// 全局搜索
const overallSearch = () => {
  // this.$store.dispatch({
  //   type: 'overallSearch',
  //   dir: '',
  //   basename: this.searchContent,
  // })
}
// 格式化日期
const formatDate = (data: any) => {
  const date = new Date(data.birthtime)
  return date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日'
}
// 格式化文件大小
const formateFileSize = (data: any) => {
  return fileLengthFormat(data.size, 1)
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
      text-align: center;
      flex: 1;
      padding: 8px;

      img {
        width: 100%;
        height: 100%;
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

  .file-name {
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
  }

  .file-size {
    float: right;
    font-size: 13px;
    color: #999;
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

  .time {
    font-size: 13px;
    color: #999;
  }

  .bottom {
    margin-top: 6px;

    .operation {
      margin-top: 6px;
    }
  }

  .button {
    padding: 0;
    margin-right: 10px;
  }
}

.icon-view .icon-lists {
  width: 100%;
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  box-sizing: border-box;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}

.clearfix:after {
  clear: both;
}
</style>

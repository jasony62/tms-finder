<template>
  <div class="files">
    <div class="demo-input-suffix row">
      <el-col :span="6" :offset="16">
        <el-input placeholder="全站搜索-请输入文件名名称" suffix-icon="el-icon-search" v-model="searchContent"></el-input>
      </el-col>
      <el-col :span="1">
        <el-button type="primary" size="small" @click="overallSearch">搜索</el-button>
      </el-col>
    </div>
    <el-table :data="files" stripe style="width: 100%" @row-dblclick="rowDbClick" v-if="radio==1">
      <el-table-column prop="createTime" label="日期" width="180" :formatter="formatDate"></el-table-column>
      <el-table-column prop="size" label="大小" width="180" :formatter="formateFileSize"></el-table-column>
      <el-table-column prop="name" label="文件名"></el-table-column>
      <el-table-column fixed="right" label="操作" width="120">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="preView(scope.$index, scope.row)">预览</el-button>
          <el-button
            type="text"
            size="small"
            @click="handleSetInfo(scope.$index, scope.row)"
            v-if="SupportSetInfo"
          >编辑</el-button>
          <el-button type="text" size="small" @click="download(scope.$index, scope.row)">下载</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="icon-view" v-if="radio==2">
      <div class="icon-lists" v-if="files.length">
        <el-card
          :class="cardClass"
          v-for="(item, index) in files"
          :key="index"
          :body-style="{ padding: '0px' }"
          shadow="never"
        >
          <div class="thumb">
            <img :src="thumbUrl(item)" @load="imgload(index)" @error="imgError" />
          </div>
          <svg class="image icon" aria-hidden="true">
            <use :xlink:href="formateFileType(item)" />
          </svg>
          <div style="padding:0 14px 14px;">
            <span class="file-name">{{item.name}}</span>
            <div class="bottom clearfix">
              <time class="time">{{formatDate(item)}}</time>
              <span class="file-size">{{formateFileSize(item)}}</span>
              <div class="operation">
                <el-button type="text" class="button" @click="preView(index, item)">预览</el-button>
                <el-button
                  type="text"
                  class="button"
                  @click="handleSetInfo(index, item)"
                  v-if="SupportSetInfo"
                >编辑</el-button>
                <el-button type="text" class="button" @click="download(index, item)">下载</el-button>
              </div>
            </div>
          </div>
        </el-card>
        <div
          :class="emptyClass"
          v-for="index in (columns - files.length % columns)"
          :key="index+'-only'"
          v-show=" files.length % columns > 0"
        ></div>
      </div>
      <div class="empty" v-else>暂无数据</div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import {
  Table,
  TableColumn,
  Input,
  Row,
  Col,
  MessageBox,
  Card
} from 'element-ui'
Vue.use(Table)
  .use(TableColumn)
  .use(Input)
  .use(Row)
  .use(Col)
  .use(Card)

import { createAndMount } from './Editor.vue'

const SupportSetInfo = !/no|false/i.test(process.env.VUE_APP_SUPPORT_SET_INFO)

export default {
  props: { domain: String, bucket: String },
  data() {
    return {
      searchContent: '',
      columns: 5,
      cardClass: 'el-card',
      emptyClass: 'empty-card',
      SupportSetInfo
    }
  },
  methods: {
    imgload(index) {
      let card_body = document.getElementsByClassName('el-card__body')[index]
      card_body.children[0].style.display = 'block'
      card_body.children[1].style.display = 'none'
    },
    imgError(e) {
      e.target.parentNode.style.display = 'none'
      e.target.parentNode.parentNode.children[1].style.display = 'block'
    },
    preView(index, file) {
      const fileurl = this.$utils.getFileUrl(file)
      const fileType = this.$utils.matchType(file.name)
      if (fileType == 'excel' || fileType == 'word') {
        window.open(fileurl)
      } else {
        import('./Preview.vue').then(Module => {
          Module.createAndMount(Vue, {
            fileurl,
            domain: this.domain,
            bucket: this.bucket
          })
        })
      }
    },
    handleSetInfo(index, file) {
      if (!file.info) file.info = {}
      const comp = createAndMount(
        Vue,
        this.schemas,
        file.path,
        file.info,
        this.domain,
        this.bucket
      )
      comp.$on('onClose', info => {
        Object.assign(file.info, info)
      })
    },
    download(index, file) {
      const fileurl = this.$utils.getFileUrl(file)
      MessageBox.confirm(fileurl, file.name, {
        confirmButtonText: '下载',
        cancelButtonText: '取消'
      }).then(() => {
        window.open(fileurl)
      })
    },
    rowDbClick(file) {
      this.$utils.postMessage(() => this.$utils.getFileUrl(file))
    },
    // 全局搜索
    overallSearch() {
      this.$store.dispatch({
        type: 'overallSearch',
        dir: '',
        basename: this.searchContent
      })
    },
    // 格式化日期
    formatDate(data) {
      const date = new Date(data.birthtime)
      return (
        date.getFullYear() +
        '年' +
        (date.getMonth() + 1) +
        '月' +
        date.getDate() +
        '日'
      )
    },
    // 格式化文件大小
    formateFileSize(data) {
      return this.fileLengthFormat(data.size, 1)
    },
    /**
     * @description 格式化文件大小
     * @params {number} total 文件大小，默认单位Byte
     * @params {number} n 1-b 2-kb 3-mb
     */
    fileLengthFormat(total, n) {
      const size = total / 1024
      if (size > 1024) {
        return this.fileLengthFormat(size, ++n)
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
    },
    // 文件类型对应图标
    formateFileType(data) {
      const fileType = this.$utils.matchType(data.name)
      let iconId = ''
      switch (fileType) {
        case false:
          iconId = '#iconicon_weizhiwenjian'
          break
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
        case 'radio':
          iconId = '#iconyunpanlogo-3'
          break
        case 'other':
          iconId = '#iconicon_weizhiwenjian'
          break
      }
      return iconId
    },
    thumbUrl(file) {
      return this.$utils.getThumbUrl(file)
    }
  },
  computed: {
    ...mapState(['schemas', 'files', 'refTree', 'radio'])
  },
  mounted() {
    if (window.screen.width >= 1920) {
      this.columns = 7
      this.cardClass = 'el-card-2'
      this.emptyClass = 'empty-card-2'
    } else {
      this.columns = 5
      this.cardClass = 'el-card'
      this.emptyClass = 'empty-card'
    }
  }
}
</script>
<style lang="less">
.files {
  display: flex;
  flex-direction: column;
  .el-input__inner {
    height: 30px;
    line-height: 30px;
  }
  .el-input__inner {
    height: 30px;
    line-height: 30px;
  }
  .demo-input-suffix {
    margin-top: 10px;
  }
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
      margin-top: 20%;
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

<template>
  <div class="info">
    <tms-flex direction="column" :gap="gap" alignItems="stretch">
      <div v-if="schemas">
        <el-table
          :data="files"
          stripe
          style="width: 100%"
          @row-dblclick="rowDbClick"
          v-if="radio==1"
        >
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column v-for="(s, k) in schemas.properties" :key="k" :prop="k" :label="s.title"></el-table-column>
          <el-table-column fixed="right" label="操作" width="120">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleSetInfo(scope.$index, scope.row)">编辑</el-button>
              <el-button type="text" size="small" @click="download(scope.$index, scope.row)">下载</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="icon-view" v-if="radio==2">
          <div class="icon-lists" v-if="files.length">
            <el-card
              :class="cardClass"
              v-for="(item, index) in files"
              :key="index+'-only'"
              :body-style="{ padding: '0px' }"
              shadow="never"
            >
              <svg class="icon" aria-hidden="true">
                <use :xlink:href="formateFileType(item)" />
              </svg>
              <div style="padding:0 14px 14px;">
                <span class="file-comment">{{item.comment}}</span>
                <div class="bottom clearfix">
                  <el-button type="text" class="button" @click="handleSetInfo(index, item)">编辑</el-button>
                  <el-button type="text" class="button" @click="download(index, item)">下载</el-button>
                </div>
              </div>
            </el-card>
            <div
              :class="emptyClass"
              v-for="index in (columns - files.length % columns)"
              :key="index"
              v-show=" files.length % columns > 0"
            ></div>
          </div>
          <div class="empty" v-else>暂无数据</div>
        </div>
      </div>
      <tms-flex class="tms-pagination">
        <el-pagination
          background
          :current-pag="batch.page"
          @current-change="batchList"
          :page-sizes="[12]"
          :page-size="batch.size"
          layout="total, sizes, prev, pager, next"
          :total="batch.total"
        ></el-pagination>
      </tms-flex>
    </tms-flex>
  </div>
</template>
<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import { Table, TableColumn, Pagination, MessageBox, Card } from 'element-ui'
import { Batch } from 'tms-vue'
import { createAndMount } from './Editor.vue'

Vue.use(Table)
  .use(TableColumn)
  .use(Pagination)
  .use(Card)

export default {
  name: 'Info',
  props: { domain: String, bucket: String },
  data() {
    return {
      gap: 4,
      files: [],
      batch: {},
      columns: 9,
      cardClass: 'el-card',
      emptyClass: 'empty-card'
    }
  },
  computed: {
    ...mapState(['schemas', 'radio'])
  },
  created() {
    const listApi = this.$apis.file.manage.list.bind(this.$apis.file.mange)
    this.batch = new Batch(listApi, this.domain, this.bucket)
    this.batch.size = 12
  },
  mounted() {
    if (window.screen.width >= 1920) {
      this.columns = 10
      this.cardClass = 'el-card-2'
      this.emptyClass = 'empty-card-2'
    } else {
      this.columns = 9
      this.cardClass = 'el-card'
      this.emptyClass = 'empty-card'
    }
    this.$store
      .dispatch({
        type: 'schemas',
        domain: this.domain,
        bucket: this.bucket
      })
      .then(() => {
        this.batchList(1)
      })
  },
  methods: {
    batchList(page) {
      this.batch.goto(page).then(batchResult => {
        this.files = batchResult.result.files
      })
    },
    handleSetInfo(index, file) {
      const comp = createAndMount(
        Vue,
        this.schemas,
        file.path,
        file,
        this.domain,
        this.bucket
      )
      comp.$on('onClose', info => {
        Object.assign(file, info)
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
    }
  }
}
</script>
<style lang="less">
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
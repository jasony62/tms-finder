<template>
  <div class="info">
    <tms-flex direction="column" :gap="gap" alignItems="stretch">
      <div v-if="schemas">
        <el-table :data="files" stripe style="width: 100%" @row-dblclick="rowDbClick">
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column v-for="(s, k) in schemas.properties" :key="k" :prop="k" :label="s.title"></el-table-column>
          <el-table-column fixed="right" label="操作" width="120">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleSetInfo(scope.$index, scope.row)">编辑</el-button>
              <el-button type="text" size="small" @click="download(scope.$index, scope.row)">下载</el-button>
            </template>
          </el-table-column>
        </el-table>
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
import { Table, TableColumn, Pagination, MessageBox } from 'element-ui'
import { Batch } from 'tms-vue'
import { createAndMount } from './Editor.vue'

Vue.use(Table)
  .use(TableColumn)
  .use(Pagination)

export default {
  name: 'Info',
  props: { domain: String, bucket: String },
  data() {
    return {
      gap: 4,
      files: [],
      batch: {}
    }
  },
  computed: {
    ...mapState(['schemas'])
  },
  created() {
    const listApi = this.$apis.file.manage.list.bind(this.$apis.file.mange)
    this.batch = new Batch(listApi, this.domain, this.bucket)
    this.batch.size = 12
  },
  mounted() {
    this.$store.dispatch('schemas')
    this.batchList(1)
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
    }
  }
}
</script>
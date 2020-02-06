<template>
  <div class="info">
    <tms-flex direction="column" :gap="gap" alignItems="stretch">
      <div v-if="schemas">
        <el-table :data="files" stripe style="width: 100%">
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column v-for="(s, k) in schemas.properties" :key="k" :prop="k" :label="s.title"></el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleSetInfo(scope.$index, scope.row)">编辑</el-button>
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
import { Table, TableColumn, Pagination } from 'element-ui'
import { Batch } from 'tms-vue'
import { createAndMount } from './Editor.vue'

Vue.use(Table)
  .use(TableColumn)
  .use(Pagination)

export default {
  name: 'Info',
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
    this.batch = new Batch(listApi)
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
      const comp = createAndMount(Vue, this.schemas, file.path, file)
      comp.$on('onClose', info => {
        Object.assign(file, info)
      })
    }
  }
}
</script>
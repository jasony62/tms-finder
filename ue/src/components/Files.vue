<template>
  <el-table :data="files" stripe style="width: 100%">
    <el-table-column prop="date" label="日期" width="180"></el-table-column>
    <el-table-column prop="size" label="大小" width="180"></el-table-column>
    <el-table-column prop="name" label="文件名"></el-table-column>
  </el-table>
</template>
<script>
import Vue from 'vue'
import { Table, TableColumn } from 'element-ui'
Vue.use(Table).use(TableColumn)
export default {
  computed: {
    files() {
      let files = this.$store.state.files
      return files
    }
  }
}
</script>

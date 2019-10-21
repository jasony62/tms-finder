<template>
  <div>
    <el-table :data="files" stripe style="width: 100%">
      <el-table-column prop="date" label="日期" width="180"></el-table-column>
      <el-table-column prop="size" label="大小" width="180"></el-table-column>
      <el-table-column prop="name" label="文件名"></el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleSetInfo(scope.$index, scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <editor ref="editor" :schemas="schemas" :file="editingFile"></editor>
  </div>
</template>
<script>
import Vue from 'vue'
import { Table, TableColumn } from 'element-ui'
Vue.use(Table).use(TableColumn)

import Editor from './Editor.vue'

export default {
  components: { Editor },
  data() {
    return {
      editingFile: { path: '', info: {} }
    }
  },
  methods: {
    handleSetInfo(index, file) {
      this.editingFile = file
      this.$refs.editor.$emit('open')
    }
  },
  computed: {
    schemas() {
      let schemas = this.$store.state.schemas
      return schemas
    },
    files() {
      let files = this.$store.state.files
      return files
    }
  }
}
</script>

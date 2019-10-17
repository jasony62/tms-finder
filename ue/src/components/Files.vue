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
      editingFile: {
        s1: '这是1条单行数据',
        s2: '设置1条多行数据',
        s3: 'v1',
        s4: ['v2'],
        s5: []
      },
      schemas: [
        { id: 's1', type: 'shorttext', title: '单行填写题' },
        { id: 's2', type: 'longtext', title: '多行填写题' },
        {
          id: 's3',
          type: 'single',
          title: '单选题',
          ops: [
            { v: 'v1', l: '选项1' },
            { v: 'v2', l: '选项2' },
            { v: 'v3', l: '选项3' }
          ]
        },
        {
          id: 's4',
          type: 'multiple',
          title: '多选题',
          ops: [
            { v: 'v1', l: '选项1' },
            { v: 'v2', l: '选项2' },
            { v: 'v3', l: '选项3' }
          ]
        },
        { id: 's5', type: 'image', title: '图片' }
      ]
    }
  },
  methods: {
    handleSetInfo(index, file) {
      this.editorFile = file
      this.$refs.editor.$emit('open')
    }
  },
  computed: {
    files() {
      let files = this.$store.state.files
      return files
    }
  }
}
</script>

<template>
  <div>
    <el-table :data="files" stripe style="width: 100%">
      <el-table-column prop="createTime" label="日期" width="180" :formatter="formatDate"></el-table-column>
      <el-table-column prop="size" label="大小" width="180" :formatter="formateFileSize"></el-table-column>
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
    },
    // 格式化日期
    formatDate(data) {
      const date = new Date(data.createTime);
      return date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDay() + '日';
    },
    // 格式化文件大小
    formateFileSize(data) {
      return this.fileLengthFormat(data.size, 1);
    },
    /**
      *@descrite 格式化文件大小
      *@params {number} total 文件大小，默认单位Byte
      *@params {number} n 1-b 2-kb 3-mb
      */
    fileLengthFormat(total, n) {
      const size = total / 1024;
      if (size > 1024) {
        return arguments.callee(size, ++n);
      } else {
        let format = size.toFixed(2);
        switch (n) {
            case 1:
                format += "KB";
                break;
            case 2:
                format += "MB";
                break;
            case 3:
                format += "GB";
                break;
            case 4:
                format += "TB";
                break;
        }
        return format;
      }
    },
    // 获取文件系统列表
    getFilesList() {
      this.$store
        .dispatch({ type: 'schemas', access_token: ''})
        .then(schemas => {
          console.log(schemas)
        });
    }
  },
  computed: {
    schemas() {
      return this.$store.state.schemas
    },
    files() {
      return this.$store.state.files
    }
  },
  created() {
    this.getFilesList();
  }
}
</script>

<template>
  <div class="files">
    <div class="demo-input-suffix row">
      <el-col :span="6" :offset="16">
        <el-input
          placeholder="全站搜索-请输入文件名名称"
          suffix-icon="el-icon-search"
          v-model="searchContent">
        </el-input>
      </el-col>
      <el-col :span="1">
        <el-button type="primary" size="small" @click="overallSearch">搜索</el-button>
      </el-col>
    </div>
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
import { mapState } from 'vuex'
import { Table, TableColumn, Input, Row, Col } from 'element-ui';
Vue.use(Table).use(TableColumn).use(Input).use(Row).use(Col);

import Editor from './Editor.vue'

export default {
  components: { Editor },
  data() {
    return {
      editingFile: { path: '', info: {} },
      searchContent: ''
    }
  },
  methods: {
    handleSetInfo(index, file) {
      this.editingFile = file
      this.$refs.editor.$emit('open')
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    // 全局搜索
    overallSearch() {
      this.$store
        .dispatch({ type: 'overallSearch', dir: '', basename: this.searchContent})
        .then(data => {
          
        });
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
        return this.fileLengthFormat(size, ++n);
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
        .dispatch('schemas')
        .then(schemas => {
          
        });
    }
  },
  computed: {
    ...mapState([
      'schemas',
      'files',
      'refTree'
    ])
  },
  created() {
    this.getFilesList();
  }
}
</script>
<style>
.files .el-input__inner {
  height: 30px;
  line-height: 30px;
}
.files .demo-input-suffix {
  margin-top: 10px;
}
</style>

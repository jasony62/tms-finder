<template>
  <div class="files">
    <div class="demo-input-suffix row" v-show="isShowSearch">
      <el-col :span="6" :offset="16">
        <el-input
          placeholder="当前文件夹搜索"
          suffix-icon="el-icon-search"
          v-model="searchContent">
        </el-input>
      </el-col>
      <el-col :span="1">
        <el-button type="primary" size="small" @click="overallSearch">搜索</el-button>
      </el-col>
    </div>
    <el-table :data="files" stripe style="width: 100%">
      <el-table-column prop="createTime" label="日期" width="240" :formatter="formatDate"></el-table-column>
      <el-table-column prop="size" label="大小" width="180" :formatter="formateFileSize"></el-table-column>
      <el-table-column prop="name" label="文件名"></el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <!-- <el-button type="text" size="small" @click="handleSetInfo(scope.$index, scope.row)">编辑</el-button> -->
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
  // watch: {
  //   isShowSearch(newVal) {
  //     // 每次重新显示搜索框-重置搜索路径
  //     if (newVal) {
  //       this.$store.state.searchPath = '';
  //     }
  //   }
  // },
  methods: {
    handleSetInfo(index, file) {
      this.editingFile = file
      this.$refs.editor.$emit('open')
    },
    // 全局搜索
    overallSearch() {
      this.$store
        .dispatch({ type: 'overallSearch', dir: this.searchPath, basename: this.searchContent})
        .then(data => {
          
        });
    },
    // 格式化日期
    formatDate(row, column, cellValue) {
      const time = new Date(cellValue);
      const year = time.getFullYear(); 
      const month = time.getMonth()+1; 
      const date = time.getDate(); 
      const hour = time.getHours(); 
      const minute = time.getMinutes(); 
      const second = time.getSeconds(); 
      return year + "年" + month + "月" + date + "日" + " " + this.isGreaterTen(hour) + ":" + this.isGreaterTen(minute) + ":" + this.isGreaterTen(second);
    },
    isGreaterTen(time) {
      return time > 9 ? time : '0' + time;
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
      'refTree',
      'isShowSearch',
      'searchPath'
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

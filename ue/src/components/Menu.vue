<template>
  <div class="menus row">
    <el-col :span="3" :offset="21">
      <el-menu :default-active="'1'" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-submenu index="1">
          <template slot="title">用户</template>
          <el-menu-item index="1-1" @click="$router.push('/login')">退出</el-menu-item>
        </el-submenu>
      </el-menu>
    </el-col>
  </div>
</template>
<script>
import Vue from 'vue'
import { Row, Col, Menu, Submenu, MenuItem } from 'element-ui';
Vue.use(Row).use(Col).use(Menu).use(Submenu).use(MenuItem);


export default {
  data() {
    return {
      
    }
  },
  methods: {
    // 选中
    handleSelect(key, keyPath) {
      // console.log(key, keyPath);
    }
  }
}
</script>
<style>
.menus .el-menu {
  background-color: #f0f3f6;
}
.menus .el-menu.el-menu--horizontal {
  border-bottom: none;
}
.menus .el-menu--horizontal>.el-submenu .el-submenu__title {
  height: 40px;
  line-height: 45px;
}
</style>

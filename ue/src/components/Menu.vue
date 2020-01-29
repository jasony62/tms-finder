<template>
  <div class="menus row">
    <el-row type="flex" justify="end">
      <el-col :span="3">
        <el-button @click="upload">上传文件</el-button>
      </el-col>
      <el-col :span="3">
        <el-menu :default-active="'1'" class="el-menu-demo" mode="horizontal">
          <el-submenu index="1">
            <template slot="title">用户</template>
            <el-menu-item index="1-1" @click="$router.push('/login')">退出</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Vue from 'vue'
import { Row, Col, Menu, Submenu, MenuItem, Button } from 'element-ui'
Vue.use(Row)
  .use(Col)
  .use(Menu)
  .use(Submenu)
  .use(MenuItem)
  .use(Button)

export default {
  data() {
    return {}
  },
  methods: {
    upload() {
      import('./Upload.vue').then(Module => {
        Module.createAndMount()
      })
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
.menus .el-menu--horizontal > .el-submenu .el-submenu__title {
  height: 40px;
  line-height: 45px;
}
</style>

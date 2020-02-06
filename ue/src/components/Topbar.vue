<template>
  <div class="topbar">
    <el-row type="flex">
      <el-col :span="18">
        <el-menu :default-active="activeIndex" mode="horizontal" @select="onMenuSelect">
          <el-menu-item index="manage">管理视图</el-menu-item>
          <el-menu-item index="storage">存储视图</el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="3">
        <el-menu class="el-menu__placeholder" mode="horizontal">
          <el-menu-item index="upload">
            <el-button @click.prevent="upload">上传文件</el-button>
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="3">
        <el-menu :default-active="'user'" mode="horizontal" @select="onMenuSelect">
          <el-submenu index="user">
            <template slot="title">用户</template>
            <el-menu-item index="login">退出</el-menu-item>
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
  props: {
    activeIndex: { type: String }
  },
  methods: {
    onMenuSelect(name) {
      this.$router.push({ name })
    },
    upload() {
      import('./Upload.vue').then(Module => {
        Module.createAndMount(Vue)
      })
    }
  }
}
</script>
<style scoped>
.el-menu__placeholder .el-menu-item.is-active {
  border-bottom: 0;
}
</style>
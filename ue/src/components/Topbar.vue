<template>
  <div class="topbar">
    <el-row type="flex">
      <el-col :span="4" v-if="SupportMultiView">
        <el-menu :default-active="activeIndex" mode="horizontal" @select="onMenuSelect">
          <el-menu-item index="manage">管理视图</el-menu-item>
          <el-menu-item index="storage">存储视图</el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="4">
        <el-menu class="el-menu__placeholder" mode="horizontal">
          <el-menu-item index="shiftView">
            <el-radio-group size="small" v-model="radio" @change="selectRadio">
              <el-radio-button label="1">列表视图</el-radio-button>
              <el-radio-button label="2">图标视图</el-radio-button>
            </el-radio-group>
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="10">
        <el-menu class="el-menu__placeholder" mode="horizontal">
          <el-menu-item index="currentDir" class="currentDir">
            <div>
              当前目录：
              <span v-if="currentDir">{{currentDir.path}}</span>
            </div>
          </el-menu-item>
          <el-menu-item index="mkdir">
            <el-button @click.prevent="mkdir">新建目录</el-button>
          </el-menu-item>
          <el-menu-item index="rmdir">
            <el-button @click.prevent="rmdir">删除目录</el-button>
          </el-menu-item>
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
import {
  Row,
  Col,
  Menu,
  Submenu,
  MenuItem,
  Button,
  RadioButton,
  RadioGroup
} from 'element-ui'
Vue.use(Row)
  .use(Col)
  .use(Menu)
  .use(Submenu)
  .use(MenuItem)
  .use(Button)
  .use(RadioButton)
  .use(RadioGroup)

const SupportMultiView = !/no|false/i.test(
  process.env.VUE_APP_SUPPORT_MULTI_VIEW
)
export default {
  props: {
    activeIndex: String,
    domain: String,
    bucket: String
  },
  data() {
    return {
      radio: this.$store.state.radio,
      SupportMultiView
    }
  },
  computed: {
    currentDir() {
      return this.$store.state.currentDir
    }
  },
  methods: {
    selectRadio(value) {
      this.$store.commit('radio', { radio: value })
    },
    onMenuSelect(name) {
      this.$router.push({ name, query: this.$route.query })
    },
    upload() {
      import('./Upload.vue').then(Module => {
        Module.createAndMount(Vue, {
          dir: this.currentDir ? this.currentDir.path : null,
          domain: this.domain,
          bucket: this.bucket
        })
      })
    },
    mkdir() {
      import('./Mkdir.vue').then(Module => {
        Module.createAndMount(Vue, {
          dir: this.currentDir ? this.currentDir.path : null,
          domain: this.domain,
          bucket: this.bucket
        })
        this.$tmsOn('onMake', () => {
          this.$tmsEmit('reFresh')
        })
      })
    },
    rmdir() {
      import('./Rmdir.vue').then(Module => {
        Module.createAndMount(Vue, {
          dir: this.currentDir ? this.currentDir.path : null,
          domain: this.domain,
          bucket: this.bucket
        })
        this.$tmsOn('onRemove', () => {
          this.$store.commit('currentDir', { dir: null })
          this.$tmsEmit('reFresh')
        })
      })
    }
  }
}
</script>
<style scoped>
.el-menu__placeholder .el-menu-item.is-active {
  border-bottom: 0;
}
.currentDir {
  width: 50%;
  overflow: hidden;
}
</style>
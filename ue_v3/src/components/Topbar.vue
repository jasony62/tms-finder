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
            <el-radio-group size="small" v-model="store.viewStyle" @change="selectViewStyle">
              <el-radio-button label="1">列表视图</el-radio-button>
              <el-radio-button label="2">图标视图</el-radio-button>
            </el-radio-group>
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="13">
        <el-menu class="el-menu__placeholder" mode="horizontal">
          <el-menu-item index="currentDir" class="currentDir">
            <div>
              当前目录：
              <span v-if="store.currentDir">{{ store.currentDir.path }}</span>
            </div>
          </el-menu-item>
          <el-menu-item index="mkdir">
            <el-button @click.prevent="mkdir">新建目录</el-button>
          </el-menu-item>
          <el-menu-item index="rmdir">
            <el-button @click.prevent="rmdir">删除目录</el-button>
          </el-menu-item>
          <el-menu-item index="upload">
            <el-button @click.prevent="upload">上传文件</el-button>
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="3">
        <el-menu :default-active="'user'" mode="horizontal" @select="onMenuSelect">
          <el-sub-menu index="user">
            <template #title>用户</template>
            <el-menu-item index="login">退出</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import Vue from 'vue'
import facStore from '@/store'
const props = defineProps({
  activeIndex: { type: String },
  domain: { type: String },
  bucket: { type: String }
})

const store = facStore()

const SupportMultiView = !/no|false/i.test(
  import.meta.env.VITE_SUPPORT_MULTI_VIEW
)

const selectViewStyle = (value: string) => {
  store.setViewStyle(value)
}

const onMenuSelect = (name) => {
  // this.$router.push({ name, query: this.$route.query })
}

const currentDir = computed(() => {
  return store.currentDir
})

const upload = () => {
  import('./Upload.vue').then((Module:any) => {
    Module.createAndMount(Vue, {
      dir: currentDir ? currentDir.path : null,
      domain: props.domain,
      bucket: props.bucket
    })
  })
}

const mkdir = () => {
  import('./Mkdir.vue').then((Module:any) => {
    Module.createAndMount(Vue, {
      dir: currentDir ? currentDir?.path : null,
      bucket: props.bucket
    })
    /*this.$tmsOn('onMake', () => {
      this.$tmsEmit('reFresh')
    })*/
  })
}
const rmdir = () => {
  import('./Rmdir.vue').then((Module: any) => {
    Module.createAndMount(Vue, {
      dir: currentDir ? currentDir.path : null,
      domain: props.domain,
      bucket: props.bucket
    })
    /*this.$tmsOn('onRemove', () => {
      this.$store.commit('currentDir', { dir: null })
      this.$tmsEmit('reFresh')
    })*/
  })
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
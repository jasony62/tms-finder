<template>
  <tms-frame class="tms-finder" :display="{header:true,footer:true,left:true}">
    <template v-slot:left>
      <tree></tree>
    </template>
    <template v-slot:center>
      <files></files>
    </template>
  </tms-frame>
</template>

<script>
import Vue from 'vue'
import { Frame } from 'tms-vue-ui'
Vue.use(Frame)

import Tree from './Tree.vue'
import Files from './Files.vue'

export default {
  name: 'Finder',
  components: { Tree, Files }
}
</script>

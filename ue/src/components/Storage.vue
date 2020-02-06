<template>
  <tms-frame class="tms-finder" :display="{header:true,footer:true,left:true}" :leftWidth="'20%'">
    <template v-slot:header>
      <topbar activeIndex="storage"></topbar>
    </template>
    <template v-slot:left>
      <tree></tree>
    </template>
    <template v-slot:center>
      <files></files>
    </template>
  </tms-frame>
</template>

<script>
import Topbar from './Topbar.vue'
import Tree from './Tree.vue'
import Files from './Files.vue'

export default {
  name: 'Storage',
  components: { Tree, Files, Topbar }
}
</script>

<template>
  <tms-frame class="tms-finder" :display="{header:true,footer:true,left:true}" :leftWidth="'20%'">
    <template v-slot:header>
      <topbar activeIndex="storage" :domain="domain" :bucket="bucket"></topbar>
    </template>
    <template v-slot:left>
      <tree :domain="domain" :bucket="bucket"></tree>
    </template>
    <template v-slot:center>
      <files :domain="domain" :bucket="bucket"></files>
    </template>
  </tms-frame>
</template>

<script>
import Topbar from './Topbar.vue'
import Tree from './Tree.vue'
import Files from './Files.vue'

export default {
  name: 'Storage',
  props: { domain: String, bucket: String },
  components: { Tree, Files, Topbar }
}
</script>

<template>
  <tms-frame class="tms-finder" :display="{header:true,footer:true}" :leftWidth="'20%'">
    <template v-slot:header>
      <topbar activeIndex="manage" :domain="domain" :bucket="bucket"></topbar>
    </template>
    <template v-slot:center>
      <info :domain="domain" :bucket="bucket"></info>
    </template>
  </tms-frame>
</template>

<script>
import Topbar from './Topbar.vue'
import Info from './Info.vue'

export default {
  name: 'Manage',
  props: { domain: String, bucket: String },
  components: { Topbar, Info }
}
</script>
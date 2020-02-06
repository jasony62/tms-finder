<template>
  <tms-frame class="tms-finder" :display="{header:true,footer:true}" :leftWidth="'20%'">
    <template v-slot:header>
      <topbar activeIndex="manage"></topbar>
    </template>
    <template v-slot:center>
      <info></info>
    </template>
  </tms-frame>
</template>

<script>
import Topbar from './Topbar.vue'
import Info from './Info.vue'

export default {
  name: 'Manage',
  components: { Topbar, Info }
}
</script>
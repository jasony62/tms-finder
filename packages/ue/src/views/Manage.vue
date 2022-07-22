<template>
  <tms-frame class="tms-finder" :display="{ header: true, footer: true }" :leftWidth="'20%'">
    <template v-slot:header>
      <topbar activeIndex="manage" :domain="domain" :bucket="bucket"></topbar>
    </template>
    <template v-slot:center>
      <info :domain="domain" :bucket="bucket"></info>
    </template>
  </tms-frame>
</template>

<script setup lang="ts">
import Topbar from '../components/Topbar.vue'
import Info from '../components/Info.vue'

defineProps({ domain: { type: String }, bucket: { type: String } })
</script>
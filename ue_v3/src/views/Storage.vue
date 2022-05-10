<template>
  <tms-frame class="tms-finder" :display="{ header: true, footer: true, left: true }" :leftWidth="'20%'">
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

<script setup lang="ts">
import Topbar from '../components/Topbar.vue'
import Tree from '../components/Tree.vue'
import Files from '../components/Files.vue'

defineProps({
  domain: { type: String }, bucket: { type: String }
})
</script>

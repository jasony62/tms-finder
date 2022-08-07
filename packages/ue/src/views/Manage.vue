<template>
  <div class="flex flex-col gap-2">
    <!--header-->
    <div class="h-16 py-4 px-2">
      <topbar activeIndex="manage" :domain="domain" :bucket="bucket"></topbar>
    </div>
    <!--content-->
    <div class="flex flex-row gap-2">
      <info :domain="domain" :bucket="bucket" class="w-full"></info>
    </div>
  </div>
</template>

<script setup lang="ts">
import Topbar from '../components/Topbar.vue'
import Info from '../components/Info.vue'

defineProps({ domain: { type: String }, bucket: { type: String } })
</script>
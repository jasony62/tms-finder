<template>
  <div class="flex flex-col gap-2">
    <!--header-->
    <div class="h-16 py-4 px-2">
      <topbar activeIndex="storage" :domain="domain" :bucket="bucket"></topbar>
    </div>
    <!--content-->
    <div class="flex flex-row gap-2">
      <div class="w-1/5">
        <tree :domain="domain" :bucket="bucket"></tree>
      </div>
      <div class="w-4/5">
        <files :domain="domain" :bucket="bucket"></files>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Topbar from '../components/Topbar.vue'
import Tree from '../components/Tree.vue'
import Files from '../components/Files.vue'

defineProps({
  domain: { type: String },
  bucket: { type: String },
})
</script>

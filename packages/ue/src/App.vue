<template>
  <router-view />
  <GDialogRoot />
</template>

<script setup lang="ts">
import { GDialogRoot } from 'gitart-vue-dialog'
</script>
<style>
html,
body,
#app {
  @apply h-full;
}

body {
  background-color: #efefef;
}
</style>
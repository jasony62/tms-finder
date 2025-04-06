<template>
  <el-drawer
    v-model="showPluginWidget"
    :size="pluginWidgetSize"
    :with-header="false"
    :show-close="false"
    :close-on-click-modal="false"
    :destroy-on-close="true"
  >
    <div class="h-full w-full relative">
      <iframe
        ref="elPluginWidget"
        class="plugin-widget"
        :src="pluginWidgetUrl"
      ></iframe>
    </div>
  </el-drawer>
</template>
<style scoped lang="scss">
.plugin-widget {
  @apply h-full w-full border-0;
}
</style>
<script setup lang="ts">
import { useTfdPlugins } from '@/composables/plugins'

const { elPluginWidget, showPluginWidget, pluginWidgetSize, pluginWidgetUrl } =
  useTfdPlugins()
</script>

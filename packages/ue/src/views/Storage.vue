<template>
  <div class="flex flex-col gap-2 h-full">
    <!--header-->
    <div class="h-16 py-4 px-2">
      <topbar activeIndex="storage" :domain="domain" :bucket="bucket"></topbar>
    </div>
    <!--content-->
    <div class="flex-grow flex flex-row gap-2 overflow-auto">
      <div class="w-1/5">
        <tree :domain="domain" :bucket="bucket"></tree>
      </div>
      <div class="w-7/10">
        <files :domain="domain" :bucket="bucket"></files>
      </div>
      <div class="w-1/10">
        <plugins
          :domain="domain"
          :bucket="bucket"
          :handle-plugin="handlePlugin"
        ></plugins>
      </div>
    </div>
  </div>
  <tfd-plugin-widget></tfd-plugin-widget>
</template>

<script setup lang="ts">
import Topbar from '../components/Topbar.vue'
import Tree from '../components/Tree.vue'
import Files from '../components/Files.vue'
import Plugins from '../components/Plugins.vue'
import { useTfdPlugins } from '../composables/plugins.js'
import TfdPluginWidget from '@/components/PluginWidget.vue'
import apiPlugin from '@/apis/plugin.js'
import Debug from 'debug'

const debug = Debug('tfd:ue:views:storage')

const props = defineProps({
  domain: { type: String },
  bucket: {
    type: String,
    default: () => {
      return ''
    },
  },
})
/**
 * 执行插件
 */
const { handlePlugin } = useTfdPlugins({
  bucketName: props.bucket,
  onExecute: (plugin: any, target: { dir: string; file: string }) => {
    debug('调用插件执行方法')
    return apiPlugin
      .execute(props.bucket, {
        pluginName: plugin.name,
        dir: target?.dir ?? '',
      })
      .then((result: any) => {
        debug('获得插件执行结果')
        return result
      })
  },
  onCreate: (plugin: any, msg: any) => {
    return msg
  },
  onClose: () => {},
})
</script>

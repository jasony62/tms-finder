<template>
  <div id="preview">
    <el-dialog title="文件预览" :closeOnClickModal="false" v-model="dialogVisible" :fullscreen="true">
      <div class="flex flex-row gap-2 h-full" style="background-color:#efefef;">
        <div class="h-full flex-grow">
          <iframe id="iframe" width="100%" height="100%" frameborder="0" :src="fileurl" marginwidth="0" marginheight="0"
            scrolling="auto"></iframe>
        </div>
        <div class="w-1/4 h-full bg-white px-2">
          <div class="file-info flex flex-col gap-2">
            <div>文件名</div>
            <div>{{ file.name }}</div>
            <div>文件字节数</div>
            <div>{{ file.size }}</div>
            <div>文件地址</div>
            <div class="break-all">{{ fileurl }}</div>
            <div v-if="supportThumbnail">缩略图地址</div>
            <div v-if="supportThumbnail" class="break-all">{{ thumburl }}</div>
            <div v-if="supportThumbnail">缩略图节数</div>
            <div v-if="supportThumbnail">{{ file.thumbSize }}</div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { SUPPORT_THUMBNAIL } from '@/global';
import { TmsFile } from '@/types';
import utils from '@/utils';
import { PropType, computed, ref } from 'vue'
import '../assets/preview.scss'

const props = defineProps({
  file: { type: Object as PropType<TmsFile>, required: true },
})

const fileurl = utils.getFileUrl(props.file)
const thumburl = utils.getThumbUrl(props.file)

const dialogVisible = ref(true)

const supportThumbnail = computed(() => SUPPORT_THUMBNAIL())
</script>

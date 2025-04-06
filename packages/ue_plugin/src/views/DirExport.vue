<template>
  <div class="flex flex-col gap-4 h-full w-full">
    <el-form label-position="right">
      <div
        class="response-content flex-grow border border-gray-200 rounded-md overflow-auto"
        v-if="responseContent"
      >
        <pre>{{ responseContent }}</pre>
      </div>
      <el-form-item>
        <el-button type="primary" @click="onExecute">执行</el-button>
        <el-button @click="onCancel" v-if="!executed">取消</el-button>
        <el-button @click="onClose" v-if="executed">关闭</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { PluginWidgetAction, PluginWidgetResult } from '@/types'
import { ref } from 'vue'
import Debug from 'debug'

const debug = Debug('tfd:ue_plugin:dir-export')
const executed = ref(false)
const responseContent = ref<string>('')

// 调用插件的宿主页面
const Caller = window.parent
const message: PluginWidgetResult = { action: PluginWidgetAction.Created }
Caller.postMessage(message, '*')

/**
 * 接收宿主页面发送的消息
 */
window.addEventListener('message', (event) => {
  const { data } = event
  const { plugin, response } = data
  if (plugin && typeof plugin === 'object') {
    debug('收到插件参数 \n%O', plugin)
  } else if (response) {
    if (typeof response === 'string') {
      responseContent.value = response
    } else if (typeof response === 'object') {
      if (response.url) {
        window.open(response.url)
      } else {
        responseContent.value = JSON.stringify(response, null, 2)
      }
    }
  }
})

function onExecute() {
  if (Caller) {
    const message: PluginWidgetResult = {
      action: PluginWidgetAction.Execute,
      result: { text: 'hello' },
      handleResponse: true,
    }
    try {
      // 给调用方发送数据
      Caller.postMessage(message, '*')
      executed.value = true
    } catch (e) {
      console.warn('未知错误', e)
    }
  }
}

function onCancel() {
  if (Caller) {
    const message: PluginWidgetResult = { action: PluginWidgetAction.Cancel }
    Caller.postMessage(message, '*')
  }
}

function onClose() {
  if (Caller) {
    const message: PluginWidgetResult = {
      action: PluginWidgetAction.Close,
      reloadOnClose: true,
    }
    Caller.postMessage(message, '*')
  }
}
</script>

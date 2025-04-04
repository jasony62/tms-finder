<template>
  <el-dialog
    title="邀请链接"
    v-model="dialogVisible"
    :destroy-on-close="true"
    :close-on-click-modal="false"
  >
    <el-form>
      <el-form-item>
        <div ref="elInviteInfo">{{ inviteInfo }}</div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="copy">复制</el-button>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const dialogVisible = ref(true)

const elInviteInfo = ref<HTMLElement | null>(null)

const props = defineProps({
  bucketName: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
})

const inviteInfo = `bucket=${props.bucketName}&nickname=${props.nickname}&code=${props.code}`

const copy = () => {
  const str = elInviteInfo.value?.innerText || ''
  navigator.clipboard.writeText(str)
}
</script>

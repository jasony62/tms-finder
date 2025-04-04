<template>
  <el-dialog
    title="接受邀请"
    v-model="dialogVisible"
    :destroy-on-close="true"
    :close-on-click-modal="false"
  >
    <el-form>
      <el-form-item label="邀请信息">
        <el-input
          v-model="inviteText"
          placeholder="请输入复制的邀请信息文本"
        ></el-input>
      </el-form-item>
      <el-divider></el-divider>
      <el-form-item label="空间名称">
        <el-input
          v-model="invite.bucket"
          placeholder="请输入空间名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="协作人名称">
        <el-input
          v-model="invite.nickname"
          placeholder="请输入协作人名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="邀请码">
        <el-input v-model="invite.code" placeholder="请输入邀请码"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="doAccept">接受邀请</el-button>
      <el-button @click="close">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { inject, reactive, ref, watch } from 'vue'
import { dialogInjectionKey } from 'gitart-vue-dialog'
import apiInvite from '@/apis/invite.js'

const $dialog = inject(dialogInjectionKey)

const dialogVisible = ref(true)

const inviteText = ref('')

const invite = reactive({ bucket: '', nickname: '', code: '' })

watch(inviteText, (newVal: string) => {
  newVal.split('&').forEach((kv: string) => {
    let kv2 = kv.split('=')
    if (kv2.length === 2) {
      switch (kv2[0]) {
        case 'bucket':
          invite.bucket = kv2[1]
          break
        case 'nickname':
          invite.nickname = kv2[1]
          break
        case 'code':
          invite.code = kv2[1]
          break
      }
    }
  })
})

const close = () => {
  dialogVisible.value = false
  $dialog?.removeDialog('bucketInviteAccept')
}

const doAccept = () => {
  const { bucket, nickname, code } = invite
  apiInvite
    .accept(bucket, nickname, code)
    .then((result: any) => {
      close()
    })
    .catch(() => {
      // @TODO 需要做什么？
    })
}
</script>

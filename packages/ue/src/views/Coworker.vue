<template>
  <div class="mt-4">
    <div class="px-2">
      <el-form :inline="true">
        <el-form-item>
          <el-button @click="back">返回</el-button>
        </el-form-item>
        <el-form-item label="被邀请用户">
          <el-input
            v-model="formInline.username"
            placeholder="请输入用户昵称"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :disabled="!formInline.username"
            @click="createInvite"
            >发起邀请</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="reloadInvite">刷新</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table :data="coworkers">
        <el-table-column property="bucket" label="空间名称" />
        <el-table-column property="coworker.username" label="协作人" />
        <el-table-column property="code" label="邀请码" />
        <el-table-column label="发起邀请时间">
          <template #default="scope">
            {{ new Date(scope.row.createAt).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column label="接受邀请时间">
          <template #default="scope">
            {{
              scope.row.acceptAt
                ? new Date(scope.row.acceptAt).toLocaleString()
                : ''
            }}
          </template>
        </el-table-column>
        <el-table-column label="拒绝邀请时间">
          <template #default="scope">
            {{
              scope.row.rejectAt
                ? new Date(scope.row.rejectAt).toLocaleString()
                : ''
            }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button @click="removeCoworker(scope.row)">删除</el-button>
            <el-button @click="showInviteInfo(scope.row)">邀请链接</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, onMounted, reactive, ref } from 'vue'
import apiInvite from '@/apis/invite.js'
import { ElMessage } from 'element-plus'
import BucketInviteInfo from '../components/BucketInviteInfo.vue'
import { dialogInjectionKey } from 'gitart-vue-dialog'

const $dialog = inject(dialogInjectionKey)

const props = defineProps({ bucket: { type: String, required: true } })

const formInline = reactive({ username: '' })
const coworkers = ref<any[]>([])

const createInvite = () => {
  apiInvite.invite(props.bucket, formInline.username).then((res: any) => {
    reloadInvite()
  })
}

const removeCoworker = (data: any) => {
  apiInvite.remove(props.bucket, data.coworker.username).then(
    (res: any) => {
      ElMessage({ message: res.msg || '删除成功', type: 'success' })
      reloadInvite()
    },
    (err: any) => {
      // 如果用户没有授权，则抛出异常
      ElMessage({ message: err.msg || '删除失败', type: 'error' })
    }
  )
}

const back = () => {
  history.back()
}

const showInviteInfo = (row: any) => {
  $dialog?.addDialog({
    component: BucketInviteInfo,
    props: {
      bucketName: props.bucket,
      username: row.coworker.username,
      code: row.code,
    },
  })
}

const reloadInvite = () => {
  apiInvite.list(props.bucket).then((data: any[]) => {
    coworkers.value.splice(0, coworkers.value.length)
    coworkers.value.push(...data)
  })
}

onMounted(() => {
  reloadInvite()
})
</script>

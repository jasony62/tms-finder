<template>
  <div id="tfd-bucket" class="mt-4">
    <!--header-->
    <div class="px-2">
      <el-form :inline="true">
        <el-form-item>
          <el-button @click="createBucket">新建</el-button>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="defaultBucketName"
            placeholder="选择默认空间"
            clearable
            style="width: 240px"
          >
            <el-option
              v-for="item in store.buckets"
              :key="item._id"
              :label="item.title"
              :value="item.name"
            />
          </el-select>
          <el-button
            @click="saveDefaultBucket"
            :loading="saveDefaultBucketLoading"
            >保存</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="reloadBucket">刷新</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--content-->
    <div>
      <el-table :data="store.buckets" stripe style="width: 100%">
        <el-table-column label="名称" width="180">
          <template #default="scope">
            <router-link
              class="text-blue-400"
              :to="{ path: '/web', query: { bucket: scope.row.name } }"
              >{{ scope.row.name }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="标题"
          width="180"
        ></el-table-column>
        <el-table-column label="创建时间">
          <template #default="scope">
            {{
              scope.row.createAt
                ? new Date(scope.row.createAt).toLocaleString()
                : ''
            }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="schemas"
          v-for="(s, k) in schemas.properties"
          :key="k"
          :prop="columnPropName(k)"
          :label="s.title"
        >
        </el-table-column>
        <el-table-column prop="description" label="说明"></el-table-column>
        <el-table-column fixed="right" label="操作" width="280">
          <template #default="scope">
            <el-button
              @click="editBucket(scope.row, scope.$index)"
              v-if="isCreator(scope.row)"
              >修改</el-button
            >
            <el-button
              @click="removeBucket(scope.row)"
              v-if="isCreator(scope.row)"
              >删除</el-button
            >
            <el-button
              @click="manageInvite(scope.row)"
              v-if="isCreator(scope.row)"
              >邀请</el-button
            >
            <el-button
              @click="acceptInvite(scope.row)"
              v-if="isInvitation(scope.row)"
              >接受</el-button
            >
            <el-button
              @click="rejectInvite(scope.row)"
              v-if="isInvitation(scope.row)"
              >拒绝</el-button
            >
            <el-button
              @click="removeBucket(scope.row)"
              v-if="isCoworker(scope.row)"
              >退出</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, inject, computed } from 'vue'
import facStore from '@/store'
import { dialogInjectionKey } from 'gitart-vue-dialog'
import { ElMessage, ElMessageBox } from 'element-plus'
import apiBucket from '@/apis/bucket.js'
import apiInvite from '@/apis/invite.js'
import BucketEditor from '../components/BucketEditor.vue'
import router from '@/router/index'

const store = facStore()
const defaultBucketName = ref('')
const $dialog = inject(dialogInjectionKey)

const schemas = computed(() => store.bucketSchemas)
const schemasRootName = computed(() => store.bucketSchemasRootName)

// 表格类对应的数据属性名称
const columnPropName = (key: any) =>
  schemasRootName.value ? schemasRootName.value + '.' + key : key

const createBucket = () => {
  $dialog?.addDialog({
    component: BucketEditor,
    props: {
      mode: 'create',
      schemas,
      schemasRootName,
      onClose: (newBucket: any) => {
        store.appendBucket(newBucket)
      },
    },
    id: 'bucket',
  })
}

const reloadBucket = () => {
  store.listBucket()
}

const removeBucket = (bucket: any) => {
  ElMessageBox.confirm(
    `${bucket.creator ? '删除' : '退出'}空间 [${bucket.title}/${
      bucket.name
    }] ?`,
    ` 请确认`,
    {
      confirmButtonText: '是',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    store.removeBucket(bucket).then(
      (res: any) => {
        ElMessage({ message: '空间已删除', type: 'success' })
      },
      (err: any) => {
        ElMessage({ message: err.msg || '删除失败', type: 'error' })
      }
    )
  })
}

const editBucket = (bucket: any, index: number) => {
  $dialog?.addDialog({
    component: BucketEditor,
    props: {
      mode: 'update',
      bucket,
      onClose: (newBucket?: any) => {
        if (newBucket) store.updateBucket({ bucket: newBucket, index })
      },
      schemas,
      schemasRootName,
    },
    id: 'bucket',
  })
}
const saveDefaultBucketLoading = ref(false)
const saveDefaultBucket = () => {
  saveDefaultBucketLoading.value = true
  apiBucket
    .setDefault(defaultBucketName.value ?? '')
    .then(() => {
      saveDefaultBucketLoading.value = false
    })
    .catch(() => {
      saveDefaultBucketLoading.value = false
    })
}

const manageInvite = (bucket: any) => {
  router.push({ name: 'coworker', params: { bucket: bucket.name } })
}

const acceptInvite = (bucket: any) => {
  store.acceptInvite(bucket)
}

const rejectInvite = (bucket: any) => {
  store.rejextInvite(bucket)
}

const isCreator = (bucket: any) => !!bucket.creator

const isCoworker = (bucket: any) => !!(!bucket.invitation && bucket.coworker)

const isInvitation = (bucket: any) => !!bucket.invitation

onMounted(() => {
  store.listBucket()
})
</script>

<template>
  <div id="joinBucket">
    <div class="flex flex-col gap-4">
      <div>{{ bucketObj.name }}</div>
      <div>{{ bucketObj.title }}</div>
      <div>{{ bucketObj.description }}</div>
    </div>
    <div><el-button @click="accept" type="primary">接受邀请</el-button></div>
  </div>
</template>
<script setup lang="ts">
import apiBucket from '@/apis/bucket.js'
import apiInvite from '@/apis/invite.js'
import router from '@/router/index'
import { ref } from 'vue'
import '../assets/css/join-bucket.css'

const props = defineProps({
  bucket: { type: String, required: true },
  nickname: { type: String, required: true },
  code: { type: String, required: true },
})

const bucketObj = ref({ name: '', title: '', description: '' })

apiBucket.byName(props.bucket).then((result: any) => {
  bucketObj.value = result
})

function accept() {
  const { bucket, nickname, code } = props
  apiInvite
    .accept(bucket, nickname, code)
    .then((result: any) => {
      router.push({ name: 'root', params: { bucket } })
    })
    .catch(() => {
      // @TODO 需要做什么？
    })
}
</script>

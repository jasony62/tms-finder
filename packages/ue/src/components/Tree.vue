<template>
  <el-tree ref="eltree" class="h-full overflow-auto" :props="treeProps" lazy :expand-on-click-node="false"
    :load="loadNode" @node-click="clickNode" @current-change="currentChange" node-key="path"></el-tree>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import facStore from '@/store'
import emitter from '@/EventBus.js'

const props = defineProps({
  domain: { type: String },
  bucket: { type: String },
})

const store = facStore()

const { domain, bucket } = props

const treeProps = {
  label: 'label',
  children: 'children',
  isLeaf: 'leaf',
}

const eltree = ref<any>(null)

const currentNode = ref<any>(null)

/**
 * 加载指定节点的子节点
 */
const loadNode = (node: any, resolve: any) => {
  if (node.level === 0) {
    let { tree } = store
    return resolve([
      {
        label: tree.name,
        children: [],
        leaf: false,
        rawData: tree
      }
    ])
  }

  store.expand(node.data.rawData, domain ?? '', bucket ?? '').then((subDirs: any) => {
    const children = subDirs.map((sd: any) => {
      return {
        label: sd.name,
        children: [],
        leaf: sd.sub.dirs === false,
        rawData: sd
      }
    })
    resolve(children)
  })
}

const currentChange = (data: any, node: any) => {
  store.setCurrentDir(data.rawData)
  currentNode.value = node
}
/**
 * 新建子目录
 */
emitter.on('mkdir', ({ name, path }) => {
  eltree.value.append({
    label: name,
    children: [],
    leaf: true,
    rawData: { path, parent: store.currentDir, sub: { files: 0, dirs: 0 } }
  }, currentNode.value)
})
/**
 * 删除子目录
 */
emitter.on('mkdir', ({ path }) => {
  if (path === store.currentDir.path) {
    eltree.value.remove(currentNode.value)
    store.setCurrentDir(null)
    currentNode.value = null
  }
})
/**
 * 获得指定目录下的文件
 */
const clickNode = (data: any, node: any) => {
  store.list(data.rawData, domain, bucket)
    .then((data: any) => {
      /**如果节点没有加载过，添加子节点*/
      if (false === node.loaded) {
        let { dirs } = data
        if (dirs && dirs.length) {
          dirs.forEach((dir: any) => {
            let leaf = dir.sub.dirs === 0
            eltree.value?.append(
              {
                label: dir.name,
                children: [],
                leaf,
                rawData: dir
              },
              node
            )
          })
        }
        node.loaded = true
      }
    })
}
</script>

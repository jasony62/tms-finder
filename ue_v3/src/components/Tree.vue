<template>
  <el-tree ref="eltree" :props="treeProps" lazy :expand-on-click-node="false" :load="loadNode" @node-click="clickNode"
    @current-change="currentChange" node-key="path"></el-tree>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import facStore from '@/store'

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

const eltree = ref(null)

const loadNode = (node, resolve) => {
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

  store.expand(node.data.rawData, domain, bucket).then(subDirs => {
    const children = subDirs.map(sd => {
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

const currentChange = (data) => {
  store.setCurrentDir(data.rawData)
}

const clickNode = (data, node) => {
  store.list(data.rawData, domain, bucket)
    .then(data => {
      if (false === node.loaded) {
        let { dirs } = data
        if (dirs && dirs.length) {
          dirs.forEach(dir => {
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

onMounted(() => {
  // this.$tmsOn('reFresh', ()=>{
  // node.childNodes = []
  // loadNode(node, resolve)
  //     }) 
})
</script>

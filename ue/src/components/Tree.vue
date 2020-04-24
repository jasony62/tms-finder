<template>
  <el-tree
    :props="defaultProps"
    lazy
    :expand-on-click-node="false"
    :load="loadNode"
    @node-click="clickNode"
    @current-change="currentChange"
    ref="tree"
    node-key="path"
  ></el-tree>
</template>
<script>
import Vue from 'vue'
import { Tree } from 'element-ui'
Vue.use(Tree)

export default {
  props: { domain: String, bucket: String },
  data() {
    return {
      defaultProps: {
        label: 'label',
        children: 'children',
        isLeaf: 'leaf',
        node: [],
        resolve: []
      },
      currentNode: {}
    }
  },
  methods: {
    loadNode(node, resolve) {
      if (node.level === 0) {
        this.node = node
        this.resolve = resolve
        let { tree } = this.$store.state
        return resolve([
          {
            label: tree.name,
            children: [],
            leaf: false,
            rawData: tree
          }
        ])
      }
      this.$store
        .dispatch({
          type: 'expand',
          dir: node.data.rawData,
          domain: this.domain,
          bucket: this.bucket
        })
        .then(subDirs => {
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
    },
    currentChange(data) {
      this.currentNode = data
      this.$store.commit('currentDir', { dir: data.rawData })
    },
    clickNode(data, node) {
      this.$store
        .dispatch({
          type: 'list',
          dir: data.rawData,
          domain: this.domain,
          bucket: this.bucket
        })
        .then(data => {
          if (false === node.loaded) {
            let { dirs } = data
            if (dirs && dirs.length) {
              dirs.forEach(dir => {
                let leaf = dir.sub.dirs === 0
                this.$refs.tree.append(
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
  },
  mounted(){
    this.$tmsOn('reFresh', ()=>{
      this.node.childNodes = []
      this.loadNode(this.node, this.resolve)
    })
  }
}
</script>

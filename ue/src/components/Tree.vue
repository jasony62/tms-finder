<template>
  <div class="left-tree">
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
    <i class="el-icon-refresh refresh" @click="refresh"></i>
  </div>
</template>
<script>
import Vue from 'vue'
import { Tree } from 'element-ui'
Vue.use(Tree)

export default {
  data() {
    return {
      defaultProps: {
        label: 'label',
        children: 'children',
        isLeaf: 'leaf'
      },
      currentNode: {},
      initNode: {},
      initResolve: '',
      currentLevel: 0
    }
  },
  watch: {
    currentLevel(newVal) {
      this.$store.state.isShowSearch = newVal > 1;
    }
  },
  methods: {
    refresh() {
      this.initNode.childNodes = []
      this.$store.commit('files', {files: []})
      this.loadNode(this.initNode, this.initResolve)
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        this.initNode = node
        this.initResolve = resolve
        const { tree } = this.$store.state
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
        .dispatch({ type: 'expand', dir: node.data.rawData })
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
      this.currentNode = data;
    },
    clickNode(data, node) {
      this.$store.dispatch({ type: 'list', dir: data.rawData }).then(data => {
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
  }
}
</script>
<style scoped>
.left-tree {
  position: relative;
}
.left-tree .refresh {
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
}
.left-tree .refresh:hover{
  color: red;
}
</style>

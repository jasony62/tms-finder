import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    schemas: null,
    tree: { name: '全部', path: '' },
    files: [],
    searchFiles: [],
    currentDir: null,
    radio: '1',
  },
  mutations: {
    schemas(state, payload) {
      state.schemas = payload.schemas
    },
    files(state, payload) {
      state.files = payload.files
    },
    appendDirs(state, payload) {
      let { dir, dirs } = payload
      dir.dirs = dirs
      dirs.forEach((d) => {
        d.path = `${dir.path}/${d.name}`
        d.parent = dir
      })
    },
    searchFiles(state, payload) {
      state.searchFiles = payload.searchFiles
    },
    currentDir(state, payload) {
      state.currentDir = payload.dir
    },
    radio(state, payload) {
      state.radio = payload.radio
    },
  },
  actions: {
    schemas({ commit }, payload) {
      let { domain, bucket } = payload
      return new Promise((resolve) => {
        Vue.$apis.file.browse.schemas(domain, bucket).then((schemas) => {
          commit({ type: 'schemas', schemas })
          resolve(schemas)
        })
      })
    },
    list({ commit }, payload) {
      let { dir, domain, bucket } = payload
      return new Promise((resolve) => {
        Vue.$apis.file.browse.list(dir.path, domain, bucket).then((listData) => {
          let { dirs, files } = listData
          commit({ type: 'appendDirs', dir, dirs })
          commit({ type: 'files', files })
          resolve({ dirs, files })
        })
      })
    },
    expand({ commit }, payload) {
      let { dir, domain, bucket } = payload
      return new Promise((resolve) => {
        Vue.$apis.file.browse.list(dir.path, domain, bucket).then((expandData) => {
          let { dirs } = expandData
          commit({ type: 'appendDirs', dir, dirs })
          resolve(dirs)
        })
      })
    },
    overallSearch({ commit }, payload) {
      let { dir, basename } = payload
      return new Promise((resolve) => {
        const params = {
          basename,
          dir: dir.path || '',
        }
        Vue.$apis.file.browse.overallSearch(params).then((searchData) => {
          let { dirs, files } = searchData
          commit({ type: 'files', files })
          resolve({ dirs, files })
        })
      })
    },
  },
})

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import browser from '../apis/file/browse'

export default new Vuex.Store({
  state: {
    tree: { name: '全部', path: '' },
    files: []
  },
  mutations: {
    files(state, payload) {
      state.files = payload.files
    },
    appendDirs(state, payload) {
      let { dir, dirs } = payload
      dir.dirs = dirs
      dirs.forEach(d => {
        d.path = `${dir.path}/${d.name}`
        d.parent = dir
      })
    }
  },
  actions: {
    list({ commit }, payload) {
      let { dir } = payload
      return new Promise((resolve, reject) => {
        browser.list(dir.path).then(listData => {
          let { dirs, files } = listData
          commit({ type: 'appendDirs', dir, dirs })
          commit({ type: 'files', files })
          resolve({ dirs, files })
        })
      })
    },
    expand({ commit }, payload) {
      let { dir } = payload
      return new Promise((resolve, reject) => {
        browser.list(dir.path).then(expandData => {
          let { dirs } = expandData
          commit({ type: 'appendDirs', dir, dirs })
          resolve(dirs)
        })
      })
    }
  }
})

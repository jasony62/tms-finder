import Vue from 'vue'
import Editor from './Editor.vue'

let EditorConstructor = Vue.extend(Editor)

export default function() {
  let instance = new EditorConstructor({
    data: {}
  })
  return instance
}

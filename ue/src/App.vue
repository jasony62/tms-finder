<template>
  <div id="app">
    <finder></finder>
  </div>
</template>

<script>
import Finder from './components/Finder.vue'

export default {
  name: 'app',
  // mounted() {
  //   this.$store.dispatch({ type: 'schemas' })
  // },
  components: {
    Finder
  }
}
</script>
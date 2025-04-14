<template>
  <div id="app">
    <navbar />
    <div class="container mt-4">
      <router-view />
    </div>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'

export default {
  name: 'App',
  components: {
    Navbar
  },
  created() {
    this.$store.dispatch('loadCart')
    this.$store.dispatch('fetchProducts')
    this.$store.dispatch('fetchCategories')
    if (this.$store.getters.isAuthenticated) {
      this.$store.dispatch('fetchCustomFields')
    }
  }
}
</script>

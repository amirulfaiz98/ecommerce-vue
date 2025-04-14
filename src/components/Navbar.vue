<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container">
      <router-link class="navbar-brand" to="/">Vue Shop</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Home</router-link>
          </li>
          <li class="nav-item" v-if="isAdmin">
            <router-link class="nav-link" to="/admin">Admin Dashboard</router-link>
          </li>
        </ul>
        <div class="d-flex align-items-center">
          <router-link to="/cart" class="btn btn-outline-light position-relative me-3">
            <i class="bi bi-cart"></i> Cart
            <span v-if="cartCount > 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {{ cartCount }}
            </span>
          </router-link>
          <button v-if="!isAdmin" @click="login" class="btn btn-outline-light">Admin Login</button>
          <button v-else @click="logout" class="btn btn-outline-light">Logout</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Navbar',
  computed: {
    ...mapGetters(['getCartCount', 'isAuthenticated']),
    cartCount() {
      return this.getCartCount
    },
    isAdmin() {
      return this.isAuthenticated
    }
  },
  methods: {
    login() {
      this.$router.push('/login')
    },
    logout() {
      this.$store.dispatch('logout')
      if (this.$route.meta.requiresAuth) {
        this.$router.push('/')
      }
    }
  }
}
</script>

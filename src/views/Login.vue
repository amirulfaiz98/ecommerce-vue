<template>
  <div class="row justify-content-center">
    <div class="col-md-6">
      <div class="card">
        <div class="card-header">
          <h3 class="mb-0">Admin Login</h3>
        </div>
        <div class="card-body">
          <div v-if="error" class="alert alert-danger">{{ error }}</div>
          <form @submit.prevent="handleLogin">
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input
                type="email"
                class="form-control"
                id="email"
                v-model="email"
                required
              >
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Password</label>
              <input
                type="password"
                class="form-control"
                id="password"
                v-model="password"
                required
              >
            </div>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              {{ loading ? 'Logging in...' : 'Login' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      error: null,
      loading: false
    }
  },
  methods: {
    async handleLogin() {
      this.error = null
      this.loading = true

      try {
        const success = await this.$store.dispatch('login', {
          email: this.email,
          password: this.password
        })

        if (success) {
          this.$router.push('/admin')
        } else {
          this.error = 'Invalid credentials'
        }
      } catch (error) {
        this.error = 'Login failed. Please try again.'
        console.error(error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

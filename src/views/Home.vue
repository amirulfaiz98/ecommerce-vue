<template>
  <div>
    <div class="row mb-4">
      <div class="col-md-4">
        <div class="input-group">
          <input type="text" class="form-control" v-model="searchQuery" placeholder="Search products...">
          <button class="btn btn-outline-secondary" type="button">Search</button>
        </div>
      </div>
      <div class="col-md-4">
        <select class="form-select" v-model="selectedCategory">
          <option value="">All Categories</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>
    </div>

    <div class="row">
      <div v-for="product in filteredProducts" :key="product.id" class="col-md-4 col-sm-6 mb-4">
        <div class="card h-100">
          <img :src="product.image" class="card-img-top" alt="Product image" style="height: 200px; object-fit: cover;">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ product.name }}</h5>
            <p class="card-text">{{ product.description }}</p>
            <div class="mt-auto">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="fw-bold text-primary">${{ product.price.toFixed(2) }}</span>
                <span :class="{'text-success': product.stock > 10, 'text-warning': product.stock <= 10 && product.stock > 0, 'text-danger': product.stock === 0}">
                  Stock: {{ product.stock }}
                </span>
              </div>
              <button
                @click="addToCart(product)"
                class="btn btn-primary w-100"
                :disabled="product.stock === 0">
                {{ product.stock === 0 ? 'Out of Stock' : 'Add to Cart' }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div v-if="filteredProducts.length === 0" class="col-12 text-center py-5">
        <h3>No products found</h3>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Home',
  data() {
    return {
      searchQuery: '',
      selectedCategory: ''
    }
  },
  computed: {
    ...mapGetters(['getProducts', 'getCategories']),
    products() {
      return this.getProducts
    },
    categories() {
      return this.getCategories
    },
    filteredProducts() {
      let result = this.products

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        result = result.filter(product =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
        )
      }

      if (this.selectedCategory) {
        result = result.filter(product => product.categoryId === this.selectedCategory)
      }

      return result
    }
  },
  methods: {
    ...mapActions(['addToCart']),
    addToCart(product) {
      if (product.stock > 0) {
        this.addToCart(product)
      }
    }
  }
}
</script>

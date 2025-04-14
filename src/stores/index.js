import { createStore } from 'vuex'
import axios from 'axios'

const API_URL = 'http://localhost:3000/api'

export default createStore({
  state: {
    products: [],
    categories: [],
    cart: [],
    customFields: [],
    isAdmin: false,
    token: localStorage.getItem('admin-token') || null
  },
  getters: {
    getProducts: state => state.products,
    getCategories: state => state.categories,
    getCart: state => state.cart,
    getCartTotal: state => {
      return state.cart.reduce((total, item) => {
        return total + (item.price * item.quantity)
      }, 0)
    },
    getCartCount: state => {
      return state.cart.reduce((count, item) => {
        return count + item.quantity
      }, 0)
    },
    getCustomFields: state => state.customFields,
    isAuthenticated: state => !!state.token
  },
  mutations: {
    SET_PRODUCTS(state, products) {
      state.products = products
    },
    SET_CATEGORIES(state, categories) {
      state.categories = categories
    },
    SET_CUSTOM_FIELDS(state, fields) {
      state.customFields = fields
    },
    ADD_TO_CART(state, product) {
      const existingItem = state.cart.find(item => item.id === product.id)
      if (existingItem) {
        existingItem.quantity++
      } else {
        state.cart.push({...product, quantity: 1})
      }
      // Save cart to localStorage
      localStorage.setItem('cart', JSON.stringify(state.cart))
    },
    REMOVE_FROM_CART(state, productId) {
      state.cart = state.cart.filter(item => item.id !== productId)
      localStorage.setItem('cart', JSON.stringify(state.cart))
    },
    UPDATE_CART_QUANTITY(state, {productId, quantity}) {
      const item = state.cart.find(item => item.id === productId)
      if (item) {
        item.quantity = quantity
      }
      localStorage.setItem('cart', JSON.stringify(state.cart))
    },
    CLEAR_CART(state) {
      state.cart = []
      localStorage.removeItem('cart')
    },
    LOAD_CART(state) {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        state.cart = JSON.parse(savedCart)
      }
    },
    SET_TOKEN(state, token) {
      state.token = token
      if (token) {
        localStorage.setItem('admin-token', token)
        state.isAdmin = true
      } else {
        localStorage.removeItem('admin-token')
        state.isAdmin = false
      }
    },
    ADD_PRODUCT(state, product) {
      state.products.push(product)
    },
    UPDATE_PRODUCT(state, updatedProduct) {
      const index = state.products.findIndex(p => p.id === updatedProduct.id)
      if (index !== -1) {
        state.products.splice(index, 1, updatedProduct)
      }
    },
    DELETE_PRODUCT(state, productId) {
      state.products = state.products.filter(p => p.id !== productId)
    },
    ADD_CATEGORY(state, category) {
      state.categories.push(category)
    },
    UPDATE_CATEGORY(state, updatedCategory) {
      const index = state.categories.findIndex(c => c.id === updatedCategory.id)
      if (index !== -1) {
        state.categories.splice(index, 1, updatedCategory)
      }
    },
    DELETE_CATEGORY(state, categoryId) {
      state.categories = state.categories.filter(c => c.id !== categoryId)
    },
    ADD_CUSTOM_FIELD(state, field) {
      state.customFields.push(field)
    },
    DELETE_CUSTOM_FIELD(state, fieldId) {
      state.customFields = state.customFields.filter(f => f.id !== fieldId)
    }
  },
  actions: {
    async fetchProducts({ commit }) {
      try {
        const response = await axios.get(`${API_URL}/products`)
        commit('SET_PRODUCTS', response.data)
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    },
    async fetchCategories({ commit }) {
      try {
        const response = await axios.get(`${API_URL}/categories`)
        commit('SET_CATEGORIES', response.data)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    },
    async fetchCustomFields({ commit }) {
      try {
        const response = await axios.get(`${API_URL}/custom-fields`, {
          headers: { Authorization: `Bearer ${this.state.token}` }
        })
        commit('SET_CUSTOM_FIELDS', response.data)
      } catch (error) {
        console.error('Error fetching custom fields:', error)
      }
    },
    addToCart({ commit }, product) {
      commit('ADD_TO_CART', product)
    },
    removeFromCart({ commit }, productId) {
      commit('REMOVE_FROM_CART', productId)
    },
    updateCartQuantity({ commit }, payload) {
      commit('UPDATE_CART_QUANTITY', payload)
    },
    clearCart({ commit }) {
      commit('CLEAR_CART')
    },
    loadCart({ commit }) {
      commit('LOAD_CART')
    },
    async login({ commit }, credentials) {
      try {
        const response = await axios.post(`${API_URL}/auth/login`, credentials)
        const token = response.data.token
        commit('SET_TOKEN', token)
        return true
      } catch (error) {
        console.error('Login failed:', error)
        return false
      }
    },
    logout({ commit }) {
      commit('SET_TOKEN', null)
    },
    async addProduct({ commit, state }, product) {
      try {
        const response = await axios.post(`${API_URL}/products`, product, {
          headers: { Authorization: `Bearer ${state.token}` }
        })
        commit('ADD_PRODUCT', response.data)
        return response.data
      } catch (error) {
        console.error('Error adding product:', error)
        throw error
      }
    },
    async updateProduct({ commit, state }, product) {
      try {
        const response = await axios.put(`${API_URL}/products/${product.id}`, product, {
          headers: { Authorization: `Bearer ${state.token}` }
        })
        commit('UPDATE_PRODUCT', response.data)
        return response.data
      } catch (error) {
        console.error('Error updating product:', error)
        throw error
      }
    },
    async deleteProduct({ commit, state }, productId) {
      try {
        await axios.delete(`${API_URL}/products/${productId}`, {
          headers: { Authorization: `Bearer ${state.token}` }
        })
        commit('DELETE_PRODUCT', productId)
      } catch (error) {
        console.error('Error deleting product:', error)
        throw error
      }
    },
    async addCategory({ commit, state }, category) {
      try {
        const response = await axios.post(`${API_URL}/categories`, category, {
          headers: { Authorization: `Bearer ${state.token}` }
        })
        commit('ADD_CATEGORY', response.data)
        return response.data
      } catch (error) {
        console.error('Error adding category:', error)
        throw error
      }
    },
    async updateCategory({ commit, state }, category) {
      try {
        const response = await axios.put(`${API_URL}/categories/${category.id}`, category, {
          headers: { Authorization: `Bearer ${state.token}` }
        })
        commit('UPDATE_CATEGORY', response.data)
        return response.data
      } catch (error) {
        console.error('Error updating category:', error)
        throw error
      }
    },
    async deleteCategory({ commit, state }, categoryId) {
      try {
        await axios.delete(`${API_URL}/categories/${categoryId}`, {
          headers: { Authorization: `Bearer ${state.token}` }
        })
        commit('DELETE_CATEGORY', categoryId)
      } catch (error) {
        console.error('Error deleting category:', error)
        throw error
      }
    },
    async bulkImportCategories({ commit, state }, categoriesData) {
      try {
        const response = await axios.post(`${API_URL}/categories/bulk-import`, categoriesData, {
          headers: { Authorization: `Bearer ${state.token}` }
        })
        // Refresh categories after bulk import
        const categoriesResponse = await axios.get(`${API_URL}/categories`)
        commit('SET_CATEGORIES', categoriesResponse.data)
        return response.data
      } catch (error) {
        console.error('Error bulk importing categories:', error)
        throw error
      }
    },
    async addCustomField({ commit, state }, field) {
      try {
        const response = await axios.post(`${API_URL}/custom-fields`, field, {
          headers: { Authorization: `Bearer ${state.token}` }
        })
        commit('ADD_CUSTOM_FIELD', response.data)
        return response.data
      } catch (error) {
        console.error('Error adding custom field:', error)
        throw error
      }
    },
    async deleteCustomField({ commit, state }, fieldId) {
      try {
        await axios.delete(`${API_URL}/custom-fields/${fieldId}`, {
          headers: { Authorization: `Bearer ${state.token}` }
        })
        commit('DELETE_CUSTOM_FIELD', fieldId)
      } catch (error) {
        console.error('Error deleting custom field:', error)
        throw error
      }
    }
  }
})

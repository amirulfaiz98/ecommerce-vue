<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Product Management</h2>
      <button class="btn btn-primary" @click="showAddModal = true">
        <i class="bi bi-plus"></i> Add Product
      </button>
    </div>

    <div class="table-responsive">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th v-for="field in customFields" :key="field.id">{{ field.name }}</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id">
            <td>
              <img :src="product.image" alt="Product" style="width: 50px; height: 50px; object-fit: cover;">
            </td>
            <td>{{ product.name }}</td>
            <td>{{ getCategoryName(product.categoryId) }}</td>
            <td>${{ product.price.toFixed(2) }}</td>
            <td>
              <span :class="{
                'text-success': product.stock > 10,
                'text-warning': product.stock <= 10 && product.stock > 0,
                'text-danger': product.stock === 0
              }">
                {{ product.stock }}
              </span>
            </td>
            <td v-for="field in customFields" :key="field.id">
              {{ getCustomFieldValue(product, field.id) }}
            </td>
            <td>
              <button @click="editProduct(product)" class="btn btn-sm btn-info me-1">
                <i class="bi bi-pencil"></i>
              </button>
              <button @click="deleteProduct(product.id)" class="btn btn-sm btn-danger">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Product Modal -->
    <div class="modal fade" id="productModal" tabindex="-1" ref="productModal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditing ? 'Edit Product' : 'Add Product' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveProduct">
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="productName" class="form-label">Product Name</label>
                    <input type="text" class="form-control" id="productName" v-model="currentProduct.name" required>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="productCategory" class="form-label">Category</label>
                    <select class="form-select" id="productCategory" v-model="currentProduct.categoryId" required>
                      <option v-for="category in categories" :key="category.id" :value="category.id">
                        {{ category.name }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <label for="productDescription" class="form-label">Description</label>
                <textarea class="form-control" id="productDescription" v-model="currentProduct.description" rows="3" required></textarea>
              </div>

              <div class="row">
                <div class="col-md-4">
                  <div class="mb-3">
                    <label for="productPrice" class="form-label">Price</label>
                    <div class="input-group">
                      <span class="input-group-text">$</span>
                      <input type="number" step="0.01" min="0" class="form-control" id="productPrice" v-model="currentProduct.price" required>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="mb-3">
                    <label for="productStock" class="form-label">Stock</label>
                    <input type="number" min="0" class="form-control" id="productStock" v-model="currentProduct.stock" required>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="mb-3">
                    <label for="productImage" class="form-label">Image URL</label>
                    <input type="text" class="form-control" id="productImage" v-model="currentProduct.image" required>
                  </div>
                </div>
              </div>

              <!-- Custom Fields -->
              <div v-if="customFields.length > 0">
                <h5>Custom Fields</h5>
                <div class="row">
                  <div v-for="field in customFields" :key="field.id" class="col-md-6">
                    <div class="mb-3">
                      <label :for="`customField_${field.id}`" class="form-label">{{ field.name }}</label>

                      <!-- Text input -->
                      <input v-if="field.type === 'text'"
                        type="text"
                        class="form-control"
                        :id="`customField_${field.id}`"
                        v-model="currentProduct.customFields[field.id]">

                      <!-- Number input -->
                      <input v-if="field.type === 'number'"
                        type="number"
                        class="form-control"
                        :id="`customField_${field.id}`"
                        v-model.number="currentProduct.customFields[field.id]">

                      <!-- Boolean input -->
                      <div v-if="field.type === 'boolean'" class="form-check">
                        <input
                          type="checkbox"
                          class="form-check-input"
                          :id="`customField_${field.id}`"
                          v-model="currentProduct.customFields[field.id]">
                        <label class="form-check-label" :for="`customField_${field.id}`">Yes/No</label>
                      </div>

                      <!-- Date input -->
                      <input v-if="field.type === 'date'"
                        type="date"
                        class="form-control"
                        :id="`customField_${field.id}`"
                        v-model="currentProduct.customFields[field.id]">
                    </div>
                  </div>
                </div>
              </div>

              <div class="text-end">
                <button type="button" class="btn btn-secondary me-2" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" class="btn btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Modal } from 'bootstrap'

export default {
  name: 'AdminProducts',
  data() {
    return {
      showAddModal: false,
      isEditing: false,
      currentProduct: {
        name: '',
        description: '',
        price: 0,
        stock: 0,
        image: '',
        categoryId: '',
        customFields: {}
      },
      productModalInstance: null
    }
  },
  computed: {
    ...mapGetters(['getProducts', 'getCategories', 'getCustomFields']),
    products() {
      return this.getProducts
    },
    categories() {
      return this.getCategories
    },
    customFields() {
      return this.getCustomFields
    }
  },
  methods: {
    getCategoryName(categoryId) {
      const category = this.categories.find(c => c.id === categoryId)
      return category ? category.name : 'Uncategorized'
    },
    getCustomFieldValue(product, fieldId) {
      return product.customFields && product.customFields[fieldId] !== undefined
        ? product.customFields[fieldId]
        : '-'
    },
    editProduct(product) {
      this.isEditing = true
      this.currentProduct = JSON.parse(JSON.stringify(product)) // Deep copy
      // Ensure customFields exists
      if (!this.currentProduct.customFields) {
        this.currentProduct.customFields = {}
      }
      this.showAddModal = true
    },
    resetForm() {
      this.currentProduct = {
        name: '',
        description: '',
        price: 0,
        stock: 0,
        image: '',
        categoryId: this.categories.length > 0 ? this.categories[0].id : '',
        customFields: {}
      }
      this.isEditing = false
    },
    async saveProduct() {
      try {
        if (this.isEditing) {
          await this.$store.dispatch('updateProduct', this.currentProduct)
        } else {
          await this.$store.dispatch('addProduct', this.currentProduct)
        }
        this.productModalInstance.hide()
        this.resetForm()
      } catch (error) {
        console.error('Failed to save product:', error)
      }
    },
    async deleteProduct(productId) {
      if (confirm('Are you sure you want to delete this product?')) {
        try {
          await this.$store.dispatch('deleteProduct', productId)
        } catch (error) {
          console.error('Failed to delete product:', error)
        }
      }
    }
  },
  watch: {
    showAddModal(val) {
      if (val) {
        this.$nextTick(() => {
          this.productModalInstance = new Modal(this.$refs.productModal)
          this.productModalInstance.show()
        })
      }
    }
  },
  mounted() {
    this.$store.dispatch('fetchCustomFields')
    // Handle modal close
    if (this.$refs.productModal) {
      this.$refs.productModal.addEventListener('hidden.bs.modal', () => {
        this.resetForm()
      })
    }
  }
}
</script>

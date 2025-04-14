<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Category Management</h2>
      <div>
        <button class="btn btn-success me-2" @click="showImportModal = true">
          <i class="bi bi-upload"></i> Bulk Import
        </button>
        <button class="btn btn-primary" @click="showAddModal = true">
          <i class="bi bi-plus"></i> Add Category
        </button>
      </div>
    </div>

    <div class="table-responsive">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Products</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="category in categories" :key="category.id">
            <td>{{ category.name }}</td>
            <td>{{ category.description }}</td>
            <td>{{ getProductCount(category.id) }}</td>
            <td>
              <button @click="editCategory(category)" class="btn btn-sm btn-info me-1">
                <i class="bi bi-pencil"></i>
              </button>
              <button @click="deleteCategory(category.id)" class="btn btn-sm btn-danger" :disabled="getProductCount(category.id) > 0">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Category Modal -->
    <div class="modal fade" id="categoryModal" tabindex="-1" ref="categoryModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditing ? 'Edit Category' : 'Add Category' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveCategory">
              <div class="mb-3">
                <label for="categoryName" class="form-label">Category Name</label>
                <input type="text" class="form-control" id="categoryName" v-model="currentCategory.name" required>
              </div>

              <div class="mb-3">
                <label for="categoryDescription" class="form-label">Description</label>
                <textarea class="form-control" id="categoryDescription" v-model="currentCategory.description" rows="3"></textarea>
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

    <!-- Bulk Import Modal -->
    <div class="modal fade" id="importModal" tabindex="-1" ref="importModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Bulk Import Categories</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <p>Enter categories in JSON format:</p>
              <div class="alert alert-info">
                Example:<br>
                <code>[{"name": "Electronics", "description": "Electronic products"}, {"name": "Books", "description": "Books and literature"}]</code>
              </div>
              <textarea
                class="form-control"
                v-model="importData"
                rows="10"
                placeholder='[{"name": "Category Name", "description": "Category Description"}]'
              ></textarea>
            </div>

            <div v-if="importError" class="alert alert-danger">{{ importError }}</div>

            <div class="text-end">
              <button type="button" class="btn btn-secondary me-2" data-bs-dismiss="modal">Cancel</button>
              <button @click="importCategories" class="btn btn-success" :disabled="isImporting">
                {{ isImporting ? 'Importing...' : 'Import' }}
              </button>
            </div>
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
  name: 'AdminCategories',
  data() {
    return {
      showAddModal: false,
      showImportModal: false,
      isEditing: false,
      currentCategory: {
        name: '',
        description: ''
      },
      importData: '',
      importError: null,
      isImporting: false,
      categoryModalInstance: null,
      importModalInstance: null
    }
  },
  computed: {
    ...mapGetters(['getProducts', 'getCategories']),
    products() {
      return this.getProducts
    },
    categories() {
      return this.getCategories
    }
  },
  methods: {
    getProductCount(categoryId) {
      return this.products.filter(p => p.categoryId === categoryId).length
    },
    editCategory(category) {
      this.isEditing = true
      this.currentCategory = { ...category } // Create a copy
      this.showAddModal = true
    },
    resetForm() {
      this.currentCategory = {
        name: '',
        description: ''
      }
      this.isEditing = false
    },
    async saveCategory() {
      try {
        if (this.isEditing) {
          await this.$store.dispatch('updateCategory', this.currentCategory)
        } else {
          await this.$store.dispatch('addCategory', this.currentCategory)
        }
        this.categoryModalInstance.hide()
        this.resetForm()
      } catch (error) {
        console.error('Failed to save category:', error)
      }
    },
    async deleteCategory(categoryId) {
      if (this.getProductCount(categoryId) > 0) {
        alert('Cannot delete a category that has products. Please move or delete the products first.')
        return
      }

      if (confirm('Are you sure you want to delete this category?')) {
        try {
          await this.$store.dispatch('deleteCategory', categoryId)
        } catch (error) {
          console.error('Failed to delete category:', error)
        }
      }
    },
    async importCategories() {
      this.importError = null
      this.isImporting = true

      try {
        // Parse the JSON input
        const categoriesData = JSON.parse(this.importData)

        // Validate that it's an array
        if (!Array.isArray(categoriesData)) {
          throw new Error('Data must be an array of categories')
        }

        // Validate each category has a name
        for (const category of categoriesData) {
          if (!category.name) {
            throw new Error('Each category must have a name')
          }
        }

        await this.$store.dispatch('bulkImportCategories', categoriesData)
        this.importModalInstance.hide()
        this.importData = ''
      } catch (error) {
        this.importError = `Import failed: ${error.message}`
      } finally {
        this.isImporting = false
      }
    }
  },
  watch: {
    showAddModal(val) {
      if (val) {
        this.$nextTick(() => {
          this.categoryModalInstance = new Modal(this.$refs.categoryModal)
          this.categoryModalInstance.show()
        })
      }
    },
    showImportModal(val) {
      if (val) {
        this.$nextTick(() => {
          this.importModalInstance = new Modal(this.$refs.importModal)
          this.importModalInstance.show()
        })
      }
    }
  },
  mounted() {
    // Handle modal close
    if (this.$refs.categoryModal) {
      this.$refs.categoryModal.addEventListener('hidden.bs.modal', () => {
        this.resetForm()
      })
    }

    if (this.$refs.importModal) {
      this.$refs.importModal.addEventListener('hidden.bs.modal', () => {
        this.importError = null
        this.importData = ''
      })
    }
  }
}
</script>

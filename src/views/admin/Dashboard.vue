<template>
  <div>
    <h2>Admin Dashboard</h2>

    <div class="row mt-4">
      <div class="col-md-4">
        <div class="card bg-primary text-white mb-4">
          <div class="card-body">
            <h5 class="card-title">Products</h5>
            <h2>{{ products.length }}</h2>
          </div>
          <div class="card-footer d-flex align-items-center justify-content-between">
            <router-link to="/admin/products" class="text-white">Manage Products</router-link>
            <div class="small text-white"><i class="bi bi-arrow-right"></i></div>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card bg-success text-white mb-4">
          <div class="card-body">
            <h5 class="card-title">Categories</h5>
            <h2>{{ categories.length }}</h2>
          </div>
          <div class="card-footer d-flex align-items-center justify-content-between">
            <router-link to="/admin/categories" class="text-white">Manage Categories</router-link>
            <div class="small text-white"><i class="bi bi-arrow-right"></i></div>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card bg-info text-white mb-4">
          <div class="card-body">
            <h5 class="card-title">Custom Fields</h5>
            <h2>{{ customFields.length }}</h2>
          </div>
          <div class="card-footer d-flex align-items-center justify-content-between">
            <a href="#" class="text-white" @click.prevent="showCustomFieldsModal = true">Manage Fields</a>
            <div class="small text-white"><i class="bi bi-arrow-right"></i></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Custom Fields Modal -->
    <div class="modal fade" id="customFieldsModal" tabindex="-1" ref="customFieldsModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Custom Fields</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div v-if="customFields.length === 0" class="text-center py-3">
              <p>No custom fields defined yet.</p>
            </div>

            <ul class="list-group" v-else>
              <li v-for="field in customFields" :key="field.id" class="list-group-item d-flex justify-content-between align-items-center">
                {{ field.name }} ({{ field.type }})
                <button @click="deleteField(field.id)" class="btn btn-sm btn-danger">
                  <i class="bi bi-trash"></i>
                </button>
              </li>
            </ul>

            <hr>

            <h6>Add New Custom Field</h6>
            <form @submit.prevent="addField">
              <div class="mb-3">
                <label for="fieldName" class="form-label">Field Name</label>
                <input type="text" class="form-control" id="fieldName" v-model="newField.name" required>
              </div>

              <div class="mb-3">
                <label for="fieldType" class="form-label">Field Type</label>
                <select class="form-select" id="fieldType" v-model="newField.type" required>
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="boolean">Boolean</option>
                  <option value="date">Date</option>
                </select>
              </div>

              <div class="d-grid">
                <button type="submit" class="btn btn-primary">Add Field</button>
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
  name: 'AdminDashboard',
  data() {
    return {
      showCustomFieldsModal: false,
      newField: {
        name: '',
        type: 'text'
      },
      customFieldsModalInstance: null
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
    async addField() {
      try {
        await this.$store.dispatch('addCustomField', this.newField)
        this.newField = { name: '', type: 'text' }
      } catch (error) {
        console.error('Failed to add custom field:', error)
      }
    },
    async deleteField(fieldId) {
      if (confirm('Are you sure you want to delete this field?')) {
        try {
          await this.$store.dispatch('deleteCustomField', fieldId)
        } catch (error) {
            console.error('Failed to delete custom field:', error)
        }
      }
    }
  },
  watch: {
    showCustomFieldsModal(val) {
      if (val) {
        this.$nextTick(() => {
          this.customFieldsModalInstance = new Modal(this.$refs.customFieldsModal)
          this.customFieldsModalInstance.show()
        })
      } else if (this.customFieldsModalInstance) {
        this.customFieldsModalInstance.hide()
      }
    }
  },
  mounted() {
    this.$store.dispatch('fetchCustomFields')
  }
}
</script>

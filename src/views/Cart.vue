<template>
  <div>
    <h2>Shopping Cart</h2>

    <div v-if="cart.length === 0" class="text-center py-5">
      <h3>Your cart is empty</h3>
      <router-link to="/" class="btn btn-primary mt-3">Continue Shopping</router-link>
    </div>

    <div v-else>
      <div class="table-responsive">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Subtotal</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in cart" :key="item.id">
              <td>
                <div class="d-flex align-items-center">
                  <img :src="item.image" alt="Product" style="width: 50px; height: 50px; object-fit: cover;" class="me-2">
                  {{ item.name }}
                </div>
              </td>
              <td>${{ item.price.toFixed(2) }}</td>
              <td>
                <div class="input-group" style="width: 120px;">
                  <button class="btn btn-outline-secondary" type="button" @click="decrementQuantity(item)" :disabled="item.quantity <= 1">-</button>
                  <input type="number" class="form-control text-center" v-model.number="item.quantity" min="1" :max="item.stock" @change="updateQuantity(item)">
                  <button class="btn btn-outline-secondary" type="button" @click="incrementQuantity(item)" :disabled="item.quantity >= item.stock">+</button>
                </div>
              </td>
              <td>${{ (item.price * item.quantity).toFixed(2) }}</td>
              <td>
                <button @click="removeItem(item.id)" class="btn btn-danger btn-sm">
                  <i class="bi bi-trash"></i> Remove
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="row mt-4">
        <div class="col-md-6">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Order Summary</h5>
              <div class="d-flex justify-content-between">
                <span>Subtotal:</span>
                <span>${{ cartTotal.toFixed(2) }}</span>
              </div>
              <div class="d-flex justify-content-between mt-2">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <hr>
              <div class="d-flex justify-content-between fw-bold">
                <span>Total:</span>
                <span>${{ cartTotal.toFixed(2) }}</span>
              </div>
              <button class="btn btn-success w-100 mt-3">Proceed to Checkout</button>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center mt-4">
        <button @click="clearCart" class="btn btn-outline-danger me-2">Clear Cart</button>
        <router-link to="/" class="btn btn-outline-primary">Continue Shopping</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Cart',
  computed: {
    ...mapGetters(['getCart', 'getCartTotal']),
    cart() {
      return this.getCart
    },
    cartTotal() {
      return this.getCartTotal
    }
  },
  methods: {
    ...mapActions(['removeFromCart', 'updateCartQuantity', 'clearCart']),
    removeItem(productId) {
      this.removeFromCart(productId)
    },
    updateQuantity(item) {
      // Ensure quantity is within stock limits
      if (item.quantity > item.stock) {
        item.quantity = item.stock
      } else if (item.quantity < 1) {
        item.quantity = 1
      }

      this.updateCartQuantity({
        productId: item.id,
        quantity: item.quantity
      })
    },
    incrementQuantity(item) {
      if (item.quantity < item.stock) {
        this.updateCartQuantity({
          productId: item.id,
          quantity: item.quantity + 1
        })
      }
    },
    decrementQuantity(item) {
      if (item.quantity > 1) {
        this.updateCartQuantity({
          productId: item.id,
          quantity: item.quantity - 1
        })
      }
    }
  }
}
</script>

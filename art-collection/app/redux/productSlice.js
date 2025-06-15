import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Mock API calls
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    const response = await fetch('/api/products')
    return response.json()
  }
)

export const updateStock = createAsyncThunk(
  'products/updateStock',
  async ({ productId, quantity }) => {
    const response = await fetch('/api/products/update-stock', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId, quantity }),
    })
    return response.json()
  }
)

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    cart: [],
    loading: false,
    error: null,
  },
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload
      const existingItem = state.cart.find(item => item.id === product.id)

      if (existingItem) {
        existingItem.quantity += 1
      } else {
        state.cart.push({ ...product, quantity: 1 })
      }
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(item => item.id !== action.payload)
    },
    updateCartQuantity: (state, action) => {
      const { id, quantity } = action.payload
      const item = state.cart.find(item => item.id === id)
      if (item) {
        item.quantity = quantity
      }
    },
    clearCart: state => {
      state.cart = []
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchProducts.pending, state => {
        state.loading = true
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(updateStock.fulfilled, (state, action) => {
        const { productId, newStock } = action.payload
        const product = state.products.find(p => p.id === productId)
        if (product) {
          product.stock = newStock
        }
      })
  },
})

export const { addToCart, removeFromCart, updateCartQuantity, clearCart } =
  productSlice.actions
export default productSlice.reducer

'use client'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts, addToCart, updateStock } from '../redux/productSlice'
import Navbar from './Navbar'
import PromoSection from './PromoSection'
import ProductGrid from './ProductGrid'
import CartModal from './CartModal'

export default function ArtpopsHome() {
  const dispatch = useDispatch()
  const { products, cart, loading } = useSelector(state => state.products)
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  const handleAddToCart = async product => {
    if (product.stock > 0) {
      dispatch(addToCart(product))
      await dispatch(updateStock({ productId: product.id, quantity: 1 }))
    }
  }

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0)

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFE3FE' }}>
      <Navbar
        cartItemsCount={cartItemsCount}
        onCartClick={() => setIsCartOpen(true)}
      />
      <PromoSection />
      <ProductGrid
        products={products}
        loading={loading}
        onAddToCart={handleAddToCart}
      />
      {isCartOpen && (
        <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      )}
    </div>
  )
}

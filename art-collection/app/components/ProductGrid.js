import ProductCard from './ProductCard'

export default function ProductGrid({ products, loading, onAddToCart }) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div
          className="animate-spin rounded-full h-12 w-12 border-b-2"
          style={{ borderColor: '#440A67' }}
        ></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pb-8">
      <h2
        className="text-3xl font-bold text-center mb-8"
        style={{ color: '#440A67' }}
      >
        สินค้าทั้งหมด
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  )
}

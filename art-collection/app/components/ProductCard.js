export default function ProductCard({ product, onAddToCart }) {
  const formatPrice = price => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full max-w-xs mx-auto">
      <div className="aspect-square bg-gray-200">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3
          className="font-semibold text-sm mb-2 line-clamp-2"
          style={{ color: '#440A67' }}
        >
          {product.name}
        </h3>
        <p className="text-lg font-bold mb-3" style={{ color: '#93329E' }}>
          {formatPrice(product.price)}
        </p>
        <p className="text-xs text-gray-600 mb-4">
          คงเหลือ: {product.stock} ชิ้น
        </p>
        <button
          onClick={() => onAddToCart(product)}
          disabled={product.stock === 0}
          className={`mt-auto w-full py-2.5 px-4 rounded-md text-sm font-medium transition-colors ${
            product.stock === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-[#440A67] text-white hover:bg-[#5b0e8a]'
          }`}
        >
          {product.stock === 0 ? 'หมด' : 'เพิ่มลงตระกร้า'}
        </button>
      </div>
    </div>
  )
}

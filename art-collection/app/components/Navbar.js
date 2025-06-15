export default function Navbar({ cartItemsCount, onCartClick }) {
  return (
    <nav
      className="sticky top-0 z-50 shadow-lg"
      style={{ backgroundColor: '#440A67' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-white">🎨 ArtToys</h1>
          </div>
          <button
            onClick={onCartClick}
            className="relative p-2 rounded-full text-white hover:bg-white hover:bg-opacity-20 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h7"
              />
            </svg>
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  )
}

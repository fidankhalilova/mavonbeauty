import { useState } from "react";
import { Plus, Heart } from "lucide-react";
import ProductQuickViewModal from "./QuickViewModal";
export default function ProductCard({ product }: any) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleQuickView = (e: any) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="bg-white rounded-lg overflow-hidden group">
        {/* Product Image */}
        <div className="relative bg-pink-50 aspect-square rounded-lg overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full rounded-lg object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Hover Actions */}
          <button
            onClick={handleQuickView}
            className="absolute bottom-4 right-4 bg-white w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-gray-50"
          >
            <Plus className="w-5 h-5" />
          </button>

          {/* Optional: Wishlist Button */}
          {product.showWishlist && (
            <button className="absolute top-4 right-4 bg-white w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-gray-50">
              <Heart className="w-5 h-5" />
            </button>
          )}

          {/* Product Badge */}
          {product.badge && (
            <span className="absolute top-4 left-4 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
              {product.badge}
            </span>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
            {product.name}
          </h3>

          {/* Price */}
          <div className="mb-3">
            {product.originalPrice ? (
              <div className="flex items-center gap-2">
                <p className="text-lg font-bold text-gray-900">
                  From ${product.price.toFixed(2)}
                </p>
                <p className="text-sm text-gray-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </p>
              </div>
            ) : (
              <p className="text-lg font-bold text-gray-900">
                From ${product.price.toFixed(2)}
              </p>
            )}
          </div>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-2 mb-3">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={
                      i < Math.floor(product.rating)
                        ? "text-gray-900"
                        : "text-gray-300"
                    }
                  >
                    ★
                  </span>
                ))}
              </div>
              {product.reviews && (
                <span className="text-sm text-gray-600">
                  ({product.reviews})
                </span>
              )}
            </div>
          )}

          {/* Color Swatches */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-2">
              {product.colors.slice(0, 3).map((color: any, idx: any) => (
                <div
                  key={idx}
                  className="w-6 h-6 rounded-full border-2 border-gray-200 cursor-pointer hover:border-gray-400 transition-colors"
                  style={{ backgroundColor: color }}
                  title={`Color variant ${idx + 1}`}
                />
              ))}
              {product.moreColors && (
                <span className="text-sm text-gray-600 font-medium">
                  +{product.moreColors}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Quick View Modal */}
      <ProductQuickViewModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

/* 
Example product data with modal fields:

const product = {
  id: 1,
  name: "Gentle Micellar Water",
  price: 700,
  originalPrice: 900, // optional
  image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600",
  description: "Gentle micellar water that effectively removes makeup and impurities while keeping your skin hydrated and fresh. Perfect for all skin types including sensitive skin.",
  colors: ['#F4C2A8', '#B8E6D5', '#4DB8AC'],
  moreColors: 2,
  colorOptions: [
    { name: 'Peach orange', hex: '#F4C2A8' },
    { name: 'Mint green', hex: '#B8E6D5' },
    { name: 'Sky blue', hex: '#87CEEB' },
    { name: 'Rose pink', hex: '#F8B4AA' },
    { name: 'Cream', hex: '#FFF5E6' }
  ],
  weightOptions: ['100gm', '50gm', '200gm'],
  badge: 'Sale', // optional
  rating: 4.8, // optional
  reviews: 142, // optional
  showWishlist: true // optional
};
*/

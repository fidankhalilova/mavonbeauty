import { useState } from "react";
import { Plus, Heart } from "lucide-react";
import ProductQuickViewModal from "./QuickViewModal";

export default function ProductCard({ product, onProductClick }: any) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleQuickView = (e: any) => {
    e.preventDefault();
    e.stopPropagation(); 
    setIsModalOpen(true);
  };

  const handleWishlist = (e: any) => {
    e.preventDefault();
    e.stopPropagation(); 
  };

  const handleCardClick = () => {
    if (!isModalOpen && onProductClick) {
      onProductClick();
    }
  };

  return (
    <>
      <div 
        onClick={handleCardClick}
        className="bg-white rounded-lg overflow-hidden group cursor-pointer"
      >
        <div className="relative bg-pink-50 aspect-square rounded-lg overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full rounded-lg object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <button
            onClick={handleQuickView}
            className="absolute bottom-4 right-4 bg-white w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-gray-50"
          >
            <Plus className="w-5 h-5" />
          </button>
          {product.showWishlist && (
            <button 
              onClick={handleWishlist}
              className="absolute top-4 right-4 bg-white w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-gray-50"
            >
              <Heart className="w-5 h-5" />
            </button>
          )}
          {product.badge && (
            <span className="absolute top-4 left-4 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
              {product.badge}
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
            {product.name}
          </h3>
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
      <ProductQuickViewModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
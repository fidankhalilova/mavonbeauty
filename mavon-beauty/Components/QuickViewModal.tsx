import { X, Minus, Plus, ArrowRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface ProductModalProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductQuickViewModal({
  product,
  isOpen,
  onClose,
}: ProductModalProps) {
  const [selectedColor, setSelectedColor] = useState(
    product.colorOptions?.[0] || null,
  );
  const [selectedWeight, setSelectedWeight] = useState(
    product.weightOptions?.[0] || null,
  );
  const [quantity, setQuantity] = useState(1);
  const detailsRef = useRef<HTMLDivElement>(null);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Reset scroll position when modal opens
      if (detailsRef.current) {
        detailsRef.current.scrollTop = 0;
      }
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleQuantityDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleQuantityIncrease = () => {
    setQuantity(quantity + 1);
  };

  // Handle input change for quantity
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1) {
      setQuantity(value);
    }
  };

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-6xl h-[90vh] flex flex-col lg:flex-row overflow-hidden rounded-xl shadow-2xl">
        {/* Close Button - Moved to top of modal */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[#0ba350] text-white flex items-center justify-center hover:bg-green-600 transition-colors shadow-lg"
        >
          <X className="w-5 h-5 lg:w-6 lg:h-6" />
        </button>

        {/* Left Side - Product Image (Fixed, 1:1 aspect ratio) */}
        <div className="lg:w-1/2 w-full h-1/2 lg:h-full p-4 lg:p-8 flex items-center justify-center bg-white">
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="w-auto h-auto max-w-full max-h-full object-contain"
              style={{
                objectFit: "contain",
              }}
            />
          </div>
        </div>

        {/* Right Side - Product Details (Scrollable) */}
        <div
          ref={detailsRef}
          className="lg:w-1/2 w-full h-1/2 lg:h-full overflow-y-auto p-6 lg:p-8"
        >
          <div className="flex flex-col space-y-6">
            {/* Product Title and Price */}
            <div className="pr-10">
              {" "}
              {/* Added padding for close button */}
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                {product.name}
              </h2>
              <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </p>
            </div>

            {/* Description */}
            {product.description && (
              <div className="text-gray-600 leading-relaxed">
                <p>{product.description}</p>
              </div>
            )}

            {/* Color Selection */}
            {product.colorOptions && product.colorOptions.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Color:{" "}
                  <span className="text-gray-900 font-semibold">
                    {selectedColor?.name || "Peach orange"}
                  </span>
                </label>
                <div className="flex items-center gap-3 flex-wrap">
                  {product.colorOptions.map((color: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full border-2 transition-all shrink-0 ${
                        selectedColor?.hex === color.hex
                          ? "border-gray-900 ring-2 ring-offset-2 ring-gray-900"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Weight Selection */}
            {product.weightOptions && product.weightOptions.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Weight:{" "}
                  <span className="text-gray-900 font-semibold">
                    {selectedWeight || "100gm"}
                  </span>
                </label>
                <div className="flex items-center gap-3 flex-wrap">
                  {product.weightOptions.map((weight: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedWeight(weight)}
                      className={`px-4 py-2 lg:px-6 lg:py-3 rounded-lg border-2 font-medium transition-all shrink-0 ${
                        selectedWeight === weight
                          ? "bg-gray-900 text-white border-gray-900"
                          : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {weight}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector - Fixed */}
            <div>
              <div className="flex items-center gap-4">
                {/* Quantity Selector */}
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={handleQuantityDecrease}
                    className="p-3 hover:bg-gray-100 transition-colors border-r border-gray-300"
                    type="button"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="w-16 text-center font-semibold focus:outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    min="1"
                  />
                  <button
                    onClick={handleQuantityIncrease}
                    className="p-3 hover:bg-gray-100 transition-colors border-l border-gray-300"
                    type="button"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button className="flex-1 bg-[#0ba350] text-white py-3 lg:py-4 rounded-lg font-semibold hover:bg-green-600 transition-colors">
                  Add To Cart
                </button>
              </div>
            </div>

            {/* Buy It Now Button */}
            <button className="w-full bg-[#0ba350] text-white py-3 lg:py-4 rounded-lg font-semibold hover:bg-green-600 transition-colors">
              Buy it now
            </button>

            {/* View Full Details Link */}
            <div className="pt-4 border-t border-gray-200">
              <a
                href="#"
                className="inline-flex items-center gap-2 text-gray-900 font-medium hover:gap-3 transition-all underline"
              >
                View full details
                <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

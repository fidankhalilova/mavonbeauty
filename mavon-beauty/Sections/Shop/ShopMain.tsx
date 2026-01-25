"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Heart,
  Columns2,
  Columns3,
  Square,
} from "lucide-react";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import ProductCard from "@/Components/ProductCard";

interface Product {
  _id: string;
  name: string;
  description: string;
  images: string[];
  brand: string;
  color: string;
  size: string;
  weight: number;
  price: number;
  stock: number;
  homePage: boolean;
}

interface Brand {
  _id: string;
  name: string;
}

interface Color {
  _id: string;
  name: string;
  hexCode: string;
}

interface Size {
  _id: string;
  name: string;
  category: string;
}

const API_BASE_URL = 'http://localhost:5000/api/v1';

export default function ShopMain() {
  const router = useRouter();
  const [layout, setLayout] = useState(3);
  const [priceRange, setPriceRange] = useState([0, 1500]);
  const [openSections, setOpenSections] = useState({
    availability: true,
    price: true,
    color: false,
    brand: true,
    weight: false,
  });

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [outOfStockOnly, setOutOfStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('date-new');

  useEffect(() => {
    fetchProducts();
    fetchBrands();
    fetchColors();
    fetchSizes();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [allProducts, selectedBrands, selectedColors, selectedSizes, inStockOnly, outOfStockOnly, priceRange, sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/products?homePage=false`);
      const data = await response.json();
      
      if (data.success) {
        setAllProducts(data.data || []);
        setFilteredProducts(data.data || []);
        
        // Set max price
        if (data.data && data.data.length > 0) {
          const maxPrice = Math.max(...data.data.map((p: Product) => p.price));
          setPriceRange([0, maxPrice]);
        }
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/brands`);
      const data = await response.json();
      if (data.success) setBrands(data.data || []);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const fetchColors = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/colors`);
      const data = await response.json();
      if (data.success) setColors(data.data || []);
    } catch (error) {
      console.error('Error fetching colors:', error);
    }
  };

  const fetchSizes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/sizes`);
      const data = await response.json();
      if (data.success) setSizes(data.data || []);
    } catch (error) {
      console.error('Error fetching sizes:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...allProducts];

    // Brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(p => selectedBrands.includes(p.brand));
    }

    // Color filter
    if (selectedColors.length > 0) {
      filtered = filtered.filter(p => selectedColors.includes(p.color));
    }

    // Size filter
    if (selectedSizes.length > 0) {
      filtered = filtered.filter(p => selectedSizes.includes(p.size));
    }

    // Availability filter
    if (inStockOnly) {
      filtered = filtered.filter(p => p.stock > 0);
    }
    if (outOfStockOnly) {
      filtered = filtered.filter(p => p.stock === 0);
    }

    // Price filter
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sorting
    switch(sortBy) {
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'date-new':
        filtered.reverse();
        break;
      case 'date-old':
        // Keep original order
        break;
    }

    setFilteredProducts(filtered);
  };

  const toggleBrand = (brandName: string) => {
    setSelectedBrands(prev => 
      prev.includes(brandName) 
        ? prev.filter(b => b !== brandName)
        : [...prev, brandName]
    );
  };

  const toggleColor = (colorName: string) => {
    setSelectedColors(prev => 
      prev.includes(colorName) 
        ? prev.filter(c => c !== colorName)
        : [...prev, colorName]
    );
  };

  const toggleSize = (sizeName: string) => {
    setSelectedSizes(prev => 
      prev.includes(sizeName) 
        ? prev.filter(s => s !== sizeName)
        : [...prev, sizeName]
    );
  };

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const getGridClass = () => {
    if (layout === 1) return "grid-cols-1";
    if (layout === 2) return "grid-cols-1 md:grid-cols-2";
    return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
  };

  const handleProductClick = (productId: string) => {
    router.push(`/shop/${productId}`);
  };

  // Transform products for ProductCard
  const transformedProducts = filteredProducts.map(product => ({
    id: product._id,
    name: product.name,
    price: product.price,
    image: product.images && product.images.length > 0 
      ? `${API_BASE_URL.replace('/api/v1', '')}${product.images[0]}`
      : 'https://via.placeholder.com/600x600?text=No+Image',
    colors: colors.filter(c => c.name === product.color).map(c => c.hexCode).slice(0, 3),
    moreColors: colors.length > 3 ? colors.length - 3 : 0,
    showWishlist: true,
    description: product.description || '',
    colorOptions: colors.map(c => ({ name: c.name, hex: c.hexCode })),
    weightOptions: sizes.map(s => s.name),
    badge: product.stock > 0 ? (product.stock < 10 ? 'Low Stock' : '') : 'Out of Stock',
  }));

  // Counts
  const inStockCount = allProducts.filter(p => p.stock > 0).length;
  const outOfStockCount = allProducts.filter(p => p.stock === 0).length;
  const brandCounts = brands.map(brand => ({
    name: brand.name,
    count: allProducts.filter(p => p.brand === brand.name).length
  }));
  const colorCounts = colors.map(color => ({
    ...color,
    count: allProducts.filter(p => p.color === color.name).length
  }));
  const sizeCounts = sizes.map(size => ({
    ...size,
    count: allProducts.filter(p => p.size === size.name).length
  }));

  const maxPrice = allProducts.length > 0 
    ? Math.max(...allProducts.map(p => p.price))
    : 1500;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white rounded-lg py-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-3">
          <button
            onClick={() => setLayout(1)}
            className={`pr-2 hover:bg-gray-100 rounded transition-colors ${
              layout === 1 ? "text-green-600" : "text-gray-400"
            }`}
            title="1 column"
          >
            <Square />
          </button>
          <button
            onClick={() => setLayout(2)}
            className={`p-2 hover:bg-gray-100 rounded transition-colors ${
              layout === 2 ? "text-green-600" : "text-gray-400"
            }`}
            title="2 columns"
          >
            <Columns2 />
          </button>
          <button
            onClick={() => setLayout(3)}
            className={`p-2 hover:bg-gray-100 rounded transition-colors ${
              layout === 3 ? "text-green-600" : "text-gray-400"
            }`}
            title="3 columns"
          >
            <Columns3 />
          </button>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          <span className="text-sm font-medium">Sort by:</span>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            <option value="name-asc">Alphabetically, A-Z</option>
            <option value="name-desc">Alphabetically, Z-A</option>
            <option value="price-asc">Price, low to high</option>
            <option value="price-desc">Price, high to low</option>
            <option value="date-old">Date, old to new</option>
            <option value="date-new">Date, new to old</option>
          </select>
          <span className="text-sm font-medium whitespace-nowrap">
            {filteredProducts.length} products
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg py-6 pr-4 sticky top-4">
            <h3 className="text-lg font-bold mb-6">Filter:</h3>

            {/* Availability Filter */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <button
                onClick={() => toggleSection("availability")}
                className="flex justify-between items-center w-full text-left font-semibold mb-4"
              >
                <span>Availability</span>
                {openSections.availability ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              {openSections.availability && (
                <div className="space-y-3">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={inStockOnly}
                        onChange={(e) => {
                          setInStockOnly(e.target.checked);
                          if (e.target.checked) setOutOfStockOnly(false);
                        }}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="text-sm">In stock</span>
                    </div>
                    <span className="text-sm text-gray-500">({inStockCount})</span>
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={outOfStockOnly}
                        onChange={(e) => {
                          setOutOfStockOnly(e.target.checked);
                          if (e.target.checked) setInStockOnly(false);
                        }}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className={`text-sm ${outOfStockCount === 0 ? 'text-gray-400' : ''}`}>
                        Out of stock
                      </span>
                    </div>
                    <span className={`text-sm ${outOfStockCount === 0 ? 'text-gray-400' : 'text-gray-500'}`}>
                      ({outOfStockCount})
                    </span>
                  </label>
                </div>
              )}
            </div>

            {/* Price Filter */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <button
                onClick={() => toggleSection("price")}
                className="flex justify-between items-center w-full text-left font-semibold mb-4"
              >
                <span>Price</span>
                {openSections.price ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              {openSections.price && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    The highest price is ${maxPrice.toFixed(2)}
                  </p>
                  <div className="relative pt-2">
                    <RangeSlider
                      defaultValue={[0, maxPrice]}
                      value={[priceRange[0], priceRange[1]]}
                      onInput={(value) => setPriceRange(value)}
                      min={0}
                      max={maxPrice}
                      step={10}
                    />
                  </div>
                  <div className="pt-4">
                    <p className="text-sm font-medium">
                      Price: ${priceRange[0]} - ${priceRange[1]}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Color Filter */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <button
                onClick={() => toggleSection("color")}
                className="flex justify-between items-center w-full text-left font-semibold mb-4"
              >
                <span>Color</span>
                {openSections.color ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              {openSections.color && (
                <div className="space-y-3">
                  {colorCounts.map((color) => (
                    <label key={color._id} className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedColors.includes(color.name)}
                          onChange={() => toggleColor(color.name)}
                          className="w-4 h-4 rounded border-gray-300"
                        />
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: color.hexCode }}
                          />
                          <span className="text-sm">{color.name}</span>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">({color.count})</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Brand Filter */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <button
                onClick={() => toggleSection("brand")}
                className="flex justify-between items-center w-full text-left font-semibold mb-4"
              >
                <span>Brand</span>
                {openSections.brand ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              {openSections.brand && (
                <div className="space-y-3">
                  {brandCounts.map((brand, index) => (
                    <label key={index} className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand.name)}
                          onChange={() => toggleBrand(brand.name)}
                          className="w-4 h-4 rounded border-gray-300"
                        />
                        <span className="text-sm">{brand.name}</span>
                      </div>
                      <span className="text-sm text-gray-500">({brand.count})</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Weight/Size Filter */}
            <div className="pb-2">
              <button
                onClick={() => toggleSection("weight")}
                className="flex justify-between items-center w-full text-left font-semibold mb-4"
              >
                <span>Size</span>
                {openSections.weight ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              {openSections.weight && (
                <div className="space-y-3">
                  {sizeCounts.map((size) => (
                    <label key={size._id} className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedSizes.includes(size.name)}
                          onChange={() => toggleSize(size.name)}
                          className="w-4 h-4 rounded border-gray-300"
                        />
                        <span className="text-sm">{size.name}</span>
                      </div>
                      <span className="text-sm text-gray-500">({size.count})</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : transformedProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No products found matching your filters</p>
            </div>
          ) : (
            <div className={`grid ${getGridClass()} gap-6`}>
              {transformedProducts.map((product) => (
                <div key={product.id}>
                  <ProductCard 
                    product={product}
                    onProductClick={() => handleProductClick(product.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
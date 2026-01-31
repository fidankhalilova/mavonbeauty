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
import Pagination from "@/Components/Pagination";
import { useTranslations } from "next-intl";

interface Product {
  _id: string;
  name: string;
  description: string;
  images: string[];
  brand: string;
  colors: string[];
  sizes: string[];
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

interface FilterState {
  selectedBrands: string[];
  selectedColors: string[];
  selectedSizes: string[];
  inStockOnly: boolean;
  outOfStockOnly: boolean;
  priceRange: [number, number];
  sortBy: string;
  openSections: {
    availability: boolean;
    price: boolean;
    color: boolean;
    brand: boolean;
    weight: boolean;
  };
  layout: number;
}

interface PaginationState {
  page: number;
  itemsPerPage: number;
}

const API_BASE_URL = "http://localhost:3001/api/v1";

// Helper function to save to localStorage
const saveToLocalStorage = (key: string, data: any) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

// Helper function to load from localStorage
const loadFromLocalStorage = (key: string, defaultValue: any) => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  }
  return defaultValue;
};

export default function ShopMain() {
  const router = useRouter();
  const t = useTranslations("Shop.main");
  // Initialize states with localStorage
  const [layout, setLayoutState] = useState(3);
  const [pagination, setPaginationState] = useState<PaginationState>({
    page: 1,
    itemsPerPage: 9, // CHANGED: 9 products per page
  });
  const [filters, setFiltersState] = useState<FilterState>({
    selectedBrands: [],
    selectedColors: [],
    selectedSizes: [],
    inStockOnly: false,
    outOfStockOnly: false,
    priceRange: [0, 1500],
    sortBy: "date-new",
    openSections: {
      availability: true,
      price: true,
      color: false,
      brand: true,
      weight: false,
    },
    layout: 3,
  });

  // Data states
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [maxPrice, setMaxPrice] = useState(1500);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on initial mount
  useEffect(() => {
    const savedLayout = loadFromLocalStorage("shop_layout", 3);
    const savedPagination = loadFromLocalStorage("shop_pagination", {
      page: 1,
      itemsPerPage: 9, // CHANGED: 9 products per page
    });
    const savedFilters = loadFromLocalStorage("shop_filters", {
      selectedBrands: [],
      selectedColors: [],
      selectedSizes: [],
      inStockOnly: false,
      outOfStockOnly: false,
      priceRange: [0, 1500],
      sortBy: "date-new",
      openSections: {
        availability: true,
        price: true,
        color: false,
        brand: true,
        weight: false,
      },
      layout: 3,
    });

    setLayoutState(savedLayout);
    setPaginationState(savedPagination);
    setFiltersState(savedFilters);
    setIsInitialized(true);
  }, []);

  // Wrapper functions to save state changes to localStorage
  const setLayout = (value: number) => {
    setLayoutState(value);
    saveToLocalStorage("shop_layout", value);
  };

  const setPagination = (
    value: PaginationState | ((prev: PaginationState) => PaginationState),
  ) => {
    setPaginationState((prev) => {
      const newValue = typeof value === "function" ? value(prev) : value;
      saveToLocalStorage("shop_pagination", newValue);
      return newValue;
    });
  };

  const setFilters = (
    value: Partial<FilterState> | ((prev: FilterState) => FilterState),
  ) => {
    setFiltersState((prev) => {
      const newValue =
        typeof value === "function"
          ? value(prev)
          : {
              ...prev,
              ...value,
            };
      saveToLocalStorage("shop_filters", newValue);
      return newValue;
    });
  };

  // Fetch all data
  useEffect(() => {
    if (!isInitialized) return;

    fetchAllData();
  }, [isInitialized]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchProducts(),
        fetchBrands(),
        fetchColors(),
        fetchSizes(),
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      const data = await response.json();

      if (data.success) {
        const products = data.data || [];
        console.log("📦 Products fetched:", products.length);
        console.log("🎨 Sample product colors:", products[0]?.colors);
        console.log("📏 Sample product sizes:", products[0]?.sizes);

        setAllProducts(products);

        // Calculate max price
        if (products.length > 0) {
          const calculatedMaxPrice = Math.max(
            ...products.map((p: Product) => p.price),
          );
          setMaxPrice(calculatedMaxPrice);

          // Update price range if it's at default
          if (filters.priceRange[1] === 1500) {
            setFilters((prev) => ({
              ...prev,
              priceRange: [0, calculatedMaxPrice],
            }));
          }
        }
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/brands`);
      const data = await response.json();
      if (data.success) {
        setBrands(data.data || []);
        console.log("🏷️ Brands fetched:", data.data?.length);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const fetchColors = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/colors`);
      const data = await response.json();
      if (data.success) {
        setColors(data.data || []);
        console.log("🎨 Colors fetched:", data.data?.length);
      }
    } catch (error) {
      console.error("Error fetching colors:", error);
    }
  };

  const fetchSizes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/sizes`);
      const data = await response.json();
      if (data.success) {
        setSizes(data.data || []);
        console.log("📏 Sizes fetched:", data.data?.length);
      }
    } catch (error) {
      console.error("Error fetching sizes:", error);
    }
  };

  // Apply filters and pagination
  useEffect(() => {
    if (!allProducts.length || !isInitialized) {
      console.log("⏳ Waiting for data or initialization...");
      return;
    }

    console.log("🔄 Applying filters...");
    let filtered = [...allProducts];

    // Apply filters
    const {
      selectedBrands,
      selectedColors,
      selectedSizes,
      inStockOnly,
      outOfStockOnly,
      priceRange,
      sortBy,
    } = filters;

    console.log("📊 Current filters:", {
      selectedBrands,
      selectedColors,
      selectedSizes,
      productCount: filtered.length,
    });

    // Brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter((p) => selectedBrands.includes(p.brand));
      console.log(`🏷️ After brand filter: ${filtered.length} products`);
    }

    // Color filter - Check if product has ANY of the selected colors
    if (selectedColors.length > 0) {
      filtered = filtered.filter((p) => {
        const productColors = p.colors || [];
        return selectedColors.some((color) => productColors.includes(color));
      });
      console.log(`🎨 After color filter: ${filtered.length} products`);
    }

    // Size filter - Check if product has ANY of the selected sizes
    if (selectedSizes.length > 0) {
      filtered = filtered.filter((p) => {
        const productSizes = p.sizes || [];
        return selectedSizes.some((size) => productSizes.includes(size));
      });
      console.log(`📏 After size filter: ${filtered.length} products`);
    }

    // Availability filter
    if (inStockOnly) {
      filtered = filtered.filter((p) => p.stock > 0);
      console.log(`✅ After in-stock filter: ${filtered.length} products`);
    }
    if (outOfStockOnly) {
      filtered = filtered.filter((p) => p.stock === 0);
      console.log(`❌ After out-of-stock filter: ${filtered.length} products`);
    }

    // Price filter
    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1],
    );
    console.log(`💰 After price filter: ${filtered.length} products`);

    // Sorting
    switch (sortBy) {
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "date-new":
        filtered.reverse();
        break;
      case "date-old":
        // Keep original order
        break;
    }

    // Calculate pagination
    const totalItems = filtered.length;
    const itemsPerPage = pagination.itemsPerPage;
    const total = Math.ceil(totalItems / itemsPerPage);

    console.log(
      `📄 Pagination: ${totalItems} items, ${itemsPerPage} per page = ${total} pages`,
    );
    setTotalPages(total);

    // Adjust current page if it exceeds total pages
    if (pagination.page > total && total > 0) {
      console.log(`🔄 Adjusting page from ${pagination.page} to 1`);
      setPagination((prev) => ({ ...prev, page: 1 }));
      return; // Return early, this will trigger another render
    }

    // Apply pagination
    const startIndex = (pagination.page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = filtered.slice(startIndex, endIndex);

    console.log(
      `🎯 Displaying products ${startIndex + 1}-${Math.min(endIndex, totalItems)} of ${totalItems}`,
    );
    setDisplayedProducts(paginatedProducts);
  }, [allProducts, filters, pagination, isInitialized]);

  // URL synchronization for sharing
  useEffect(() => {
    if (!isInitialized) return;

    const params = new URLSearchParams();

    // Add pagination
    params.set("page", pagination.page.toString());

    // Add filters
    if (filters.selectedBrands.length > 0) {
      params.set("brands", filters.selectedBrands.join(","));
    }
    if (filters.selectedColors.length > 0) {
      params.set("colors", filters.selectedColors.join(","));
    }
    if (filters.selectedSizes.length > 0) {
      params.set("sizes", filters.selectedSizes.join(","));
    }
    if (filters.inStockOnly) {
      params.set("inStock", "true");
    }
    if (filters.outOfStockOnly) {
      params.set("outOfStock", "true");
    }
    params.set("minPrice", filters.priceRange[0].toString());
    params.set("maxPrice", filters.priceRange[1].toString());
    if (filters.sortBy !== "date-new") {
      params.set("sort", filters.sortBy);
    }
    if (layout !== 3) {
      params.set("layout", layout.toString());
    }

    // Update URL without page reload
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({ path: newUrl }, "", newUrl);
  }, [pagination, filters, layout, isInitialized]);

  // Parse URL on initial load
  useEffect(() => {
    if (typeof window === "undefined" || !isInitialized) return;

    const params = new URLSearchParams(window.location.search);

    // Parse pagination
    const page = parseInt(params.get("page") || "1");
    if (page && page !== pagination.page) {
      setPagination((prev) => ({ ...prev, page }));
    }

    // Parse layout
    const urlLayout = parseInt(params.get("layout") || "");
    if (urlLayout && urlLayout !== layout) {
      setLayout(urlLayout);
    }

    // Parse filters
    const urlBrands = params.get("brands")?.split(",") || [];
    const urlColors = params.get("colors")?.split(",") || [];
    const urlSizes = params.get("sizes")?.split(",") || [];
    const urlInStock = params.get("inStock") === "true";
    const urlOutOfStock = params.get("outOfStock") === "true";
    const urlMinPrice = parseFloat(params.get("minPrice") || "0");
    const urlMaxPrice = parseFloat(
      params.get("maxPrice") || maxPrice.toString(),
    );
    const urlSort = params.get("sort") || "date-new";

    // Only update if URL params exist and are different
    if (params.toString()) {
      setFilters((prev) => ({
        ...prev,
        selectedBrands: urlBrands.length > 0 ? urlBrands : prev.selectedBrands,
        selectedColors: urlColors.length > 0 ? urlColors : prev.selectedColors,
        selectedSizes: urlSizes.length > 0 ? urlSizes : prev.selectedSizes,
        inStockOnly: urlInStock,
        outOfStockOnly: urlOutOfStock,
        priceRange: [
          urlMinPrice !== 0 ? urlMinPrice : prev.priceRange[0],
          urlMaxPrice !== maxPrice ? urlMaxPrice : prev.priceRange[1],
        ],
        sortBy: urlSort !== "date-new" ? urlSort : prev.sortBy,
      }));
    }
  }, [isInitialized]); // Only run once after initialization

  // Filter handlers
  const toggleBrand = (brandName: string) => {
    setFilters((prev) => {
      const newBrands = prev.selectedBrands.includes(brandName)
        ? prev.selectedBrands.filter((b) => b !== brandName)
        : [...prev.selectedBrands, brandName];
      return { ...prev, selectedBrands: newBrands };
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const toggleColor = (colorName: string) => {
    setFilters((prev) => {
      const newColors = prev.selectedColors.includes(colorName)
        ? prev.selectedColors.filter((c) => c !== colorName)
        : [...prev.selectedColors, colorName];
      return { ...prev, selectedColors: newColors };
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const toggleSize = (sizeName: string) => {
    setFilters((prev) => {
      const newSizes = prev.selectedSizes.includes(sizeName)
        ? prev.selectedSizes.filter((s) => s !== sizeName)
        : [...prev.selectedSizes, sizeName];
      return { ...prev, selectedSizes: newSizes };
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const toggleAvailability = (type: "inStock" | "outOfStock") => {
    setFilters((prev) => ({
      ...prev,
      inStockOnly: type === "inStock" ? !prev.inStockOnly : false,
      outOfStockOnly: type === "outOfStock" ? !prev.outOfStockOnly : false,
    }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const setPriceRange = (range: [number, number]) => {
    setFilters((prev) => ({ ...prev, priceRange: range }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const setSortBy = (sortValue: string) => {
    setFilters((prev) => ({ ...prev, sortBy: sortValue }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const toggleSection = (section: keyof typeof filters.openSections) => {
    setFilters((prev) => ({
      ...prev,
      openSections: {
        ...prev.openSections,
        [section]: !prev.openSections[section],
      },
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      selectedBrands: [],
      selectedColors: [],
      selectedSizes: [],
      inStockOnly: false,
      outOfStockOnly: false,
      priceRange: [0, maxPrice],
      sortBy: "date-new",
      openSections: {
        availability: true,
        price: true,
        color: false,
        brand: true,
        weight: false,
      },
      layout: 3,
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
    // Scroll to top of products section
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const getGridClass = () => {
    if (layout === 1) return "grid-cols-1";
    if (layout === 2) return "grid-cols-1 md:grid-cols-2";
    return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
  };

  const handleProductClick = (productId: string) => {
    router.push(`/shop/${productId}`);
  };

  // In ShopMain component - update the transformedProducts mapping:
  // In ShopMain component - make sure this transformation is correct
  const transformedProducts = displayedProducts.map((product) => {
    // Debug the raw product data first
    console.log("🔄 Transforming product:", {
      name: product.name,
      rawColors: product.colors,
      rawSizes: product.sizes,
      colorsFromDB: product.colors, // This is from database
      sizesFromDB: product.sizes, // This is from database
      colorsLength: product.colors?.length,
      sizesLength: product.sizes?.length,
      colorsType: typeof product.colors,
      sizesType: typeof product.sizes,
    });

    // Get available colors and sizes from your collections
    console.log("📊 Available data:", {
      colorsCollection: colors.map((c) => c.name),
      sizesCollection: sizes.map((s) => s.name),
    });

    // Get product colors and sizes
    const productColors = product.colors || [];
    const productSizes = product.sizes || [];

    // Get color hex codes for display
    const productColorHexes = colors
      .filter((c) => productColors.includes(c.name))
      .map((c) => c.hexCode);

    // Get color options for modal (array of {name, hex})
    const colorOptions = colors
      .filter((c) => productColors.includes(c.name))
      .map((c) => ({ name: c.name, hex: c.hexCode }));

    console.log("🎨 Derived data:", {
      colorOptions,
      colorOptionsLength: colorOptions.length,
      weightOptions: productSizes,
      productColorHexes,
    });

    return {
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0]
        ? `${API_BASE_URL.replace("/api/v1", "")}${product.images[0]}`
        : "https://via.placeholder.com/600x600?text=No+Image",
      colors: productColorHexes.slice(0, 3),
      moreColors:
        productColorHexes.length > 3 ? productColorHexes.length - 3 : 0,
      showWishlist: true,
      description: product.description || "",
      // CRITICAL: These must be set for the modal
      colorOptions: colorOptions,
      weightOptions: productSizes,
      badge:
        product.stock > 0
          ? product.stock < 10
            ? "Low Stock"
            : ""
          : "Out of Stock",
    };
  });

  // Counts for filter badges
  const inStockCount = allProducts.filter((p) => p.stock > 0).length;
  const outOfStockCount = allProducts.filter((p) => p.stock === 0).length;

  const brandCounts = brands.map((brand) => ({
    name: brand.name,
    count: allProducts.filter((p) => p.brand === brand.name).length,
  }));

  // Color counts - count products that have this color in their array
  const colorCounts = colors.map((color) => ({
    ...color,
    count: allProducts.filter((p) => (p.colors || []).includes(color.name))
      .length,
  }));

  // Size counts - count products that have this size in their array
  const sizeCounts = sizes.map((size) => ({
    ...size,
    count: allProducts.filter((p) => (p.sizes || []).includes(size.name))
      .length,
  }));

  console.log("📊 Filter counts:", {
    colors: colorCounts.map((c) => `${c.name}: ${c.count}`),
    sizes: sizeCounts.map((s) => `${s.name}: ${s.count}`),
  });

  const hasActiveFilters =
    filters.selectedBrands.length > 0 ||
    filters.selectedColors.length > 0 ||
    filters.selectedSizes.length > 0 ||
    filters.inStockOnly ||
    filters.outOfStockOnly ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < maxPrice ||
    filters.sortBy !== "date-new";

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
            value={filters.sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            <option value="name-asc">{t("sortOptions.nameAsc")}</option>
            <option value="name-desc">{t("sortOptions.nameDesc")}</option>
            <option value="price-asc">{t("sortOptions.priceAsc")}</option>
            <option value="price-desc">{t("sortOptions.priceDesc")}</option>
            <option value="date-old">{t("sortOptions.dateOld")}</option>
            <option value="date-new">{t("sortOptions.dateNew")}</option>
          </select>
          <span className="text-sm font-medium whitespace-nowrap">
            {allProducts.length} {t("products")}
            {displayedProducts.length !== allProducts.length && (
              <span className="text-gray-500 ml-1">
                ({t("showing")} {displayedProducts.length})
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 items-center">
            {filters.selectedBrands.map((brand) => (
              <span
                key={brand}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"
              >
                {t("activeFilters.brand")} {brand}
                <button
                  onClick={() => toggleBrand(brand)}
                  className="ml-1.5 hover:text-emerald-900"
                >
                  ×
                </button>
              </span>
            ))}
            {filters.selectedColors.map((color) => (
              <span
                key={color}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                Color: {color}
                <button
                  onClick={() => toggleColor(color)}
                  className="ml-1.5 hover:text-blue-900"
                >
                  ×
                </button>
              </span>
            ))}
            {filters.selectedSizes.map((size) => (
              <span
                key={size}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
              >
                Size: {size}
                <button
                  onClick={() => toggleSize(size)}
                  className="ml-1.5 hover:text-purple-900"
                >
                  ×
                </button>
              </span>
            ))}
            {filters.inStockOnly && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                In Stock Only
                <button
                  onClick={() => toggleAvailability("inStock")}
                  className="ml-1.5 hover:text-green-900"
                >
                  ×
                </button>
              </span>
            )}
            {filters.outOfStockOnly && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Out of Stock Only
                <button
                  onClick={() => toggleAvailability("outOfStock")}
                  className="ml-1.5 hover:text-red-900"
                >
                  ×
                </button>
              </span>
            )}
            {filters.priceRange[0] > 0 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Min: ${filters.priceRange[0]}
                <button
                  onClick={() => setPriceRange([0, filters.priceRange[1]])}
                  className="ml-1.5 hover:text-yellow-900"
                >
                  ×
                </button>
              </span>
            )}
            {filters.priceRange[1] < maxPrice && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Max: ${filters.priceRange[1]}
                <button
                  onClick={() =>
                    setPriceRange([filters.priceRange[0], maxPrice])
                  }
                  className="ml-1.5 hover:text-yellow-900"
                >
                  ×
                </button>
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="text-xs text-emerald-600 hover:text-emerald-700 font-medium px-3 py-1"
            >
              {t("activeFilters.clearAll")}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg py-6 pr-4 sticky top-4">
            <h3 className="text-lg font-bold mb-6">{t("filter")}</h3>

            {/* Availability Filter */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <button
                onClick={() => toggleSection("availability")}
                className="flex justify-between items-center w-full text-left font-semibold mb-4"
              >
                <span>{t("availability")}</span>
                {filters.openSections.availability ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              {filters.openSections.availability && (
                <div className="space-y-3">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={filters.inStockOnly}
                        onChange={() => toggleAvailability("inStock")}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="text-sm">{t("inStock")}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      ({inStockCount})
                    </span>
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={filters.outOfStockOnly}
                        onChange={() => toggleAvailability("outOfStock")}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span
                        className={`text-sm ${outOfStockCount === 0 ? "text-gray-400" : ""}`}
                      >
                        {t("outOfStock")}
                      </span>
                    </div>
                    <span
                      className={`text-sm ${outOfStockCount === 0 ? "text-gray-400" : "text-gray-500"}`}
                    >
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
                <span>{t("price")}</span>
                {filters.openSections.price ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              {filters.openSections.price && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    {t("highestPrice")}
                    {maxPrice.toFixed(2)}
                  </p>
                  <div className="relative pt-2">
                    <RangeSlider
                      value={filters.priceRange}
                      onInput={setPriceRange}
                      min={0}
                      max={maxPrice}
                      step={10}
                    />
                  </div>
                  <div className="pt-4">
                    <p className="text-sm font-medium">
                      {t.raw("priceRange")[0]}${filters.priceRange[0]}{" "}
                      {t.raw("priceRange")[1]} ${filters.priceRange[1]}
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
                <span>{t("color")}</span>
                {filters.openSections.color ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              {filters.openSections.color && colorCounts.length > 0 && (
                <div className="space-y-3">
                  {colorCounts.map((color) => (
                    <label
                      key={color._id}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={filters.selectedColors.includes(color.name)}
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
                      <span className="text-sm text-gray-500">
                        ({color.count})
                      </span>
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
                <span>{t("brand")}</span>
                {filters.openSections.brand ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              {filters.openSections.brand && brandCounts.length > 0 && (
                <div className="space-y-3">
                  {brandCounts.map((brand, index) => (
                    <label
                      key={index}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={filters.selectedBrands.includes(brand.name)}
                          onChange={() => toggleBrand(brand.name)}
                          className="w-4 h-4 rounded border-gray-300"
                        />
                        <span className="text-sm">{brand.name}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        ({brand.count})
                      </span>
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
                <span>{t("size")}</span>
                {filters.openSections.weight ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              {filters.openSections.weight && sizeCounts.length > 0 && (
                <div className="space-y-3">
                  {sizeCounts.map((size) => (
                    <label
                      key={size._id}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={filters.selectedSizes.includes(size.name)}
                          onChange={() => toggleSize(size.name)}
                          className="w-4 h-4 rounded border-gray-300"
                        />
                        <span className="text-sm">{size.name}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        ({size.count})
                      </span>
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
              <p className="text-gray-500">{t("noProducts")}</p>
              <button
                onClick={clearAllFilters}
                className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                {t("activeFilters.clearAll")}
              </button>
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>

      {/* Pagination - ALWAYS SHOW IF PRODUCTS EXIST */}
      {allProducts.length > 0 && totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={pagination.page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            maxVisiblePages={5}
          />
        </div>
      )}
    </div>
  );
}

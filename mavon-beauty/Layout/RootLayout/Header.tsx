import { Search, ShoppingCart, User, ChevronDown } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50"
      style={{ fontFamily: '"Montserrat", sans-serif' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-19">
          <div className="shrink-0">
            <img
              src="https://mavon-beauty.myshopify.com/cdn/shop/files/mavon_140x.png?v=1691552606"
              alt="mavon"
              className="h-6"
            />
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-black hover:text-gray-600 font-semibold"
            >
              Home
            </Link>
            <div className="relative group">
              <Link
                href="/shop"
                className="text-black flex justify-center items-center hover:text-gray-600 font-semibold"
              >
                Shop
                <ChevronDown className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <Link
              href="/Blog"
              className="text-black hover:text-gray-600 font-semibold"
            >
              Blog
            </Link>
            <Link
              href="/about-us"
              className="text-black hover:text-gray-600 font-semibold"
            >
              About Us
            </Link>
            <div className="relative group">
              <Link
                href="/faq"
                className="text-black flex justify-center items-center hover:text-gray-600 font-semibold"
              >
                Faq
                <ChevronDown className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="relative group">
              <Link
                href="/contact-us"
                className="text-black flex justify-center items-center hover:text-gray-600 font-semibold"
              >
                Contact Us
                <ChevronDown className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <button className="text-black hover:text-gray-900 px-4">
              <Search className="h-5.5 w-5.5" />
            </button>
            <div className="h-6 w-px bg-black"></div>
            <button className="relative text-black hover:text-gray-900 px-4">
              <ShoppingCart className="h-5.5 w-5.5" />
              <span className="absolute bottom-3 right-2 bg-[#0AA360] text-white text-xs rounded-full h-4.5 w-4.5 flex items-center justify-center">
                0
              </span>
            </button>
            <div className="h-6 w-px bg-black"></div>
            <button className="text-black hover:text-gray-900 pl-4">
              <User className="h-5.5 w-5.5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

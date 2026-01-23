import { Twitter, Facebook, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 mt-20">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">About</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Use this text area to inform your customers about your brand and
              vision. You can modify it in the theme editor.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-blue-400 hover:text-blue-500 transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-blue-600 hover:text-blue-700 transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-pink-600 hover:text-pink-700 transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-900 hover:text-gray-700 transition-colors"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Search
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Search
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Account
                </a>
              </li>
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Explore</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Refund Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Shipping & Returns
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Contact Info
            </h3>
            <p className="text-gray-600 italic leading-relaxed">
              Share information such as the store's physical address, contact
              details, opening hours, etc.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-gray-600 text-sm text-center lg:text-left">
              © 2026, Mavon - Health & Beauty Shopify Theme Powered by Shopify
            </p>

            {/* Language & Payment Icons */}
            <div className="flex items-center gap-6">
              {/* Language Selector */}
              <select className="text-sm text-gray-600 border border-gray-300 rounded px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-gray-300">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>

              {/* Payment Icons */}
              <div className="flex gap-2">
                <div className="w-10 h-7 bg-white border border-gray-200 rounded flex items-center justify-center">
                  <span className="text-blue-700 font-bold text-xs">VISA</span>
                </div>
                <div className="w-10 h-7 bg-white border border-gray-200 rounded flex items-center justify-center">
                  <div className="flex gap-0.5">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  </div>
                </div>
                <div className="w-10 h-7 bg-blue-600 border border-gray-200 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xs">AMEX</span>
                </div>
                <div className="w-10 h-7 bg-white border border-gray-200 rounded flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-xs">P</span>
                </div>
                <div className="w-10 h-7 bg-white border border-gray-200 rounded flex items-center justify-center">
                  <div className="w-3 h-3 bg-blue-700 rounded-sm"></div>
                </div>
                <div className="w-10 h-7 bg-white border border-gray-200 rounded flex items-center justify-center">
                  <span className="text-orange-500 font-bold text-xs">D</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

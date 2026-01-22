export default function AboutUsHeader() {
  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-[#f7f8f9] py-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#333333] mb-4 tracking-wide uppercase">
            Products
          </h1>
          <div className="flex items-center justify-start gap-2 text-gray-600 text-md">
            <a href="/" className="hover:text-[#333333] transition-colors">
              Home
            </a>
            <span>/</span>
            <a href="/shop" className="text-[#333333]">
              Shop
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

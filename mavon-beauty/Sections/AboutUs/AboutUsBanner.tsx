export default function AboutUsHeader() {
  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-[#333333] mb-4 tracking-wide">
          About us
        </h1>
        <div className="flex items-center justify-center gap-2 text-gray-600">
          <a href="/" className="hover:text-[#333333] transition-colors">
            Home
          </a>
          <span>/</span>
          <span className="text-[#333333]">About us</span>
        </div>
      </div>
    </div>
  );
}

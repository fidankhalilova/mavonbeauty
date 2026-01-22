import Offer from "@/Sections/Shop/Offer";
import ShopBanner from "@/Sections/Shop/ShopBanner";

export default function ShopTemplate() {
  return (
    <div className="mb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <ShopBanner />
      <Offer />
    </div>
  );
}

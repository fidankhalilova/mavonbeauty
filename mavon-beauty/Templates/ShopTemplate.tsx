import Offer from "@/Sections/Shop/Offer";
import ShopBanner from "@/Sections/Shop/ShopBanner";
import ShopMain from "@/Sections/Shop/ShopMain";
import ShopSubs from "@/Sections/Shop/ShopSubs";
import Suggestions from "@/Sections/Shop/Suggestions";

export default function ShopTemplate() {
  return (
    <div className="mb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <ShopBanner />
      <Offer />
      <ShopMain />
      <Suggestions />
      <ShopSubs />
    </div>
  );
}

import DetailSubs from "@/Sections/ShopDetail/DetailSubs";
import Recent from "@/Sections/ShopDetail/Recent";
import Recommended from "@/Sections/ShopDetail/Recommended";
import ShopDetailMain from "@/Sections/ShopDetail/ShopDetailMain";
import ShopDirection from "@/Sections/ShopDetail/ShopDirection";

export default function ShopDetailTemplate() {
  return (
    <div className="mb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <ShopDetailMain />
      <Recommended />
      <ShopDirection />
      <Recent />
      <DetailSubs />
    </div>
  );
}

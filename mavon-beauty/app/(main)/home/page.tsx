import FeaturedProducts from "@/Sections/Home/FeaturedProducts";
import HeroBanner from "@/Sections/Home/HerroBanner";
import MostPopular from "@/Sections/Home/MostPopular";
import ProductCards from "@/Sections/Home/ProductCards";
import ShopByCollection from "@/Sections/Home/Shopbycollection";

export default function HomePage() {
    return (
        <>
            <HeroBanner/>
            <ProductCards/>
            <MostPopular/>
            <ShopByCollection/>
            <FeaturedProducts/>
        </>
    )
}

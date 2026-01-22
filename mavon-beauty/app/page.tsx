import SubsEmail from "@/Sections/Home/SubsEmail";
import FeaturedProducts from "@/Sections/Home/FeaturedProducts";
import HeroBanner from "@/Sections/Home/HerroBanner";
import MostPopular from "@/Sections/Home/MostPopular";
import ProductCards from "@/Sections/Home/ProductCards";
import ProductDetailSection from "@/Sections/Home/ProductDetailSection";
import ScrollSnapHero from "@/Sections/Home/ScrollSnapHero";
import ShopByCollection from "@/Sections/Home/Shopbycollection";
import TestimonialSection from "@/Sections/Home/Testimonial";
import TextSlider from "@/Sections/Home/TextSlider";

export default function HomePage() {
    return (
        <>
            <HeroBanner/>
            <ProductCards/>
            <MostPopular/>
            <ShopByCollection/>
            <FeaturedProducts/>
            <MostPopular/>
            <TextSlider/>
            <ProductDetailSection/>
            <ScrollSnapHero/>
            <TestimonialSection/>
            <SubsEmail/>
        </>
    )
}

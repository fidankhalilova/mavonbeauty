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
import { redirect } from "next/navigation";
import { routing } from "@/i18n/routing";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  return (
    <>
      <HeroBanner />
      <ProductCards />
      <MostPopular />
      <ShopByCollection />
      <FeaturedProducts />
      <MostPopular />
      <TextSlider />
      <ProductDetailSection />
      <ScrollSnapHero />
      <TestimonialSection />
      <SubsEmail />
    </>
  );
}

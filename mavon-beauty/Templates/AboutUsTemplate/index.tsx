import AboutStore from "@/Sections/AboutUs/AboutStore";
import AboutUsBanner from "@/Sections/AboutUs/AboutUsBanner";
import CustomerImportance from "@/Sections/AboutUs/CustomerImportance";
import Slogan from "@/Sections/AboutUs/Slogan";
import SubsEmail from "@/Sections/AboutUs/SubsEmail";
export default function AboutUsTemplate() {
  return (
    <div className="mb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <AboutUsBanner />
      <Slogan />
      <AboutStore />
      <CustomerImportance />
      <SubsEmail />
    </div>
  );
}

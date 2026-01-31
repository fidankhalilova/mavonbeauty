import SubsEmail from "@/Sections/Home/SubsEmail";
import ContactSection from "@/Sections/ContactUs/ContactSection";
import MapSection from "@/Sections/ContactUs/Map";
export default function ContactUsPage() {
    return (
        <><ContactSection />
            <MapSection />
            <div className="-mt-12.5">
                <SubsEmail />
            </div>
        </>
    );
}
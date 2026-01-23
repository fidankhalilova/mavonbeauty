export default function MapSection() {
    return (
        <div className="w-full bg-white py-16 px-4 sm:px-6 lg:px-8 -mt-25">
            <div className="max-w-7xl mx-auto">
                <div className="w-full h-125 rounded-lg overflow-hidden shadow-lg">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2381.6474261474665!2d-6.264968!3d53.344104!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48670e99733f3959%3A0x593260c3906bc10!2s1-2%20Adam%20Court%2C%20Merchant's%20Quay%2C%20Dublin%2C%20D02%20W077%2C%20Ireland!5e0!3m2!1sen!2s!4v1234567890"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Store Location Map"
                    ></iframe>
                </div>
            </div>
        </div>
    );
}
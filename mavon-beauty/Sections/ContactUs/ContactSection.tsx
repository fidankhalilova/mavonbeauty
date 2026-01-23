export default function ContactUsPage() {
    return (
        <div className="min-h-screen bg-white py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-20 mt-5">Contact us:</h1>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-6 space-y-16">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-700 mb-4">Information</h2>
                            <p className="text-gray-500 leading-relaxed">
                                Share information such as the store's physical address, contact details, opening hours, etc.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-700 mb-4">Customer service</h2>
                            <p className="text-gray-500">company@demo.com</p>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-700 mb-4">Address:</h2>
                            <p className="text-gray-500 leading-relaxed">
                                Share your company address so customers can find your store.
                            </p>
                        </div>
                    </div>
                    <div className="lg:col-span-6 -mt-30">
                        <div className="bg-[#9BD0A51A] rounded-[15px] p-20">
                            <div className="mb-12">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">You can contact us anytime.</h2>
                                <p className="text-gray-500 text-sm">Please complete the following fields.</p>
                            </div>
                            <div className="space-y-16">
                                <div>
                                    <input 
                                        type="text"
                                        placeholder="Name"
                                        className="w-full border-b border-gray-400 bg-transparent pb-1 focus:outline-none focus:border-gray-600 transition-colors placeholder:text-gray-900 placeholder:font-semibold text-gray-900 font-semibold"
                                    />
                                </div>
                                <div>
                                    <input 
                                        type="email"
                                        placeholder="Email"
                                        className="w-full border-b border-gray-400 bg-transparent pb-1 focus:outline-none focus:border-gray-600 transition-colors placeholder:text-gray-900 placeholder:font-semibold text-gray-900 font-semibold"
                                    />
                                </div>
                                <div>
                                    <input 
                                        type="tel"
                                        placeholder="Phone number"
                                        className="w-full border-b border-gray-400 bg-transparent pb-1 focus:outline-none focus:border-gray-600 transition-colors placeholder:text-gray-900 placeholder:font-semibold text-gray-900 font-semibold"
                                    />
                                </div>
                                <div>
                                    <textarea 
                                        rows={1}
                                        placeholder="Comment"
                                        className="w-full border-b border-gray-400 bg-transparent pb-1 focus:outline-none focus:border-gray-600 transition-colors resize-none placeholder:text-gray-900 placeholder:font-semibold text-gray-900 font-semibold"
                                    />
                                </div>
                                <div className="flex justify-center pt-10">
                                    <button className="text-gray-900 text-[18px] underline hover:no-underline transition-all font-semibold">
                                        Send
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
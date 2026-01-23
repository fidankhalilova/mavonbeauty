"use client"

export default function ProductCards() {
    const cards = [
        {
            title: "Unleash Your Inner Beauty",
            discount: "UP TO 50% DISCOUNT",
            buttonText: "BUY NOW",
            image: "https://mavon-beauty.myshopify.com/cdn/shop/files/1_a7c74b39-0d33-4595-9838-3cb418b09b37.png?v=1685784522&width=1420"
        },
        {
            title: "Embrace Your Uniqueness",
            discount: "UP TO 30% DISCOUNT",
            buttonText: "BUY NOW",
            image: "https://mavon-beauty.myshopify.com/cdn/shop/files/2_2f40edaf-81a4-44d8-a8a6-939110caa86c.png?v=1685784564&width=1420"
        },
        {
            title: "Reveal Your Beauty",
            discount: "UP TO 50% DISCOUNT",
            buttonText: "BUY NOW",
            image: "https://mavon-beauty.myshopify.com/cdn/shop/files/3_3296bc0e-1e98-408b-817a-eb50ebf8330a.png?v=1685784593&width=1420"
        }
    ];
    return (
        <section className="py-8 mt-7.5 md:py-16 px-4 md:px-8" style={{ fontFamily: '"Montserrat", sans-serif' }}>
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row gap-6">
                    {cards.map((card, index) => (
                        <div
                            key={index}
                            className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 relative h-100 md:h-125 w-full md:w-auto md:flex-1"
                            style={{
                                flexBasis: index === 1 ? '50%' : '25%',
                                backgroundImage: card.image ? `url(${card.image})` : 'none',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}
                        >
                            <div className="absolute inset-0 bg-black/10"></div>
                            <div className="relative p-6 md:p-8 h-full flex flex-col justify-start">
                                <div>
                                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 md:mb-4 leading-tight">
                                        {card.title}
                                    </h3>
                                    <p className="text-sm md:text-base text-white/90 font-medium mb-4 md:mb-6">
                                        {card.discount}
                                    </p>
                                    <button className="bg-black text-white px-6 md:px-8 py-2 md:py-3 text-sm md:text-base font-semibold hover:bg-gray-800 transition-colors duration-300">
                                        {card.buttonText}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
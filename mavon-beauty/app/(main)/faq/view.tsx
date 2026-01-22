"use client"
import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface Question {
    id: number;
    question: string;
    answer: string;
}

interface FAQCard {
    id: string;
    image: string;
    title: string;
    questions: Question[];
}

export default function FAQSection() {
    const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

    const toggleItem = (cardId: string, itemId: number) => {
        const key = `${cardId}-${itemId}`;
        setOpenItems(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const faqCards: FAQCard[] = [
        {
            id: 'makeup',
            image: 'https://mavon-beauty.myshopify.com/cdn/shop/files/Frame_5.png?v=1686370982&width=750',
            title: 'Collapsible heading',
            questions: [
                {
                    id: 1,
                    question: 'What is the best way to remove makeup?',
                    answer: 'A gentle cleanser will remove makeup without stripping your skin of its natural oils. Look for a cleanser that is oil-free and non-comedogenic, which means it will not clog your pores.'
                },
                {
                    id: 2,
                    question: 'What are the benefits of using sunscreen?',
                    answer: 'Sunscreen protects your skin from harmful UV rays, prevents premature aging, reduces the risk of skin cancer, and helps maintain an even skin tone.'
                },
                {
                    id: 3,
                    question: 'What are some ways to prevent hair loss?',
                    answer: 'Maintain a balanced diet rich in proteins and vitamins, avoid excessive heat styling, use gentle hair products, manage stress levels, and consult a dermatologist if needed.'
                },
                {
                    id: 4,
                    question: 'How can I prevent hair loss?',
                    answer: 'Keep your scalp healthy with regular washing, avoid tight hairstyles, use sulfate-free shampoos, get enough sleep, and ensure adequate nutrition with biotin and iron.'
                }
            ]
        },
        {
            id: 'skincare',
            image: 'https://mavon-beauty.myshopify.com/cdn/shop/files/Frame_6.png?v=1686371560&width=750',
            title: 'Collapsible heading',
            questions: [
                {
                    id: 1,
                    question: 'How can I get rid of acne?',
                    answer: 'You can basically do anything you want to do as you think. Just think blue all over. Just think about these things in your mind and drop em\' on canvas.'
                },
                {
                    id: 2,
                    question: 'How can I enhance my natural beauty?',
                    answer: 'Focus on skincare basics like cleansing, moisturizing, and sun protection. Get adequate sleep, stay hydrated, eat a balanced diet, and embrace your unique features with confidence.'
                },
                {
                    id: 3,
                    question: 'What are the latest beauty trends?',
                    answer: 'Current trends include clean beauty products, minimal makeup looks, skin cycling routines, sustainable packaging, and personalized skincare based on skin analysis.'
                },
                {
                    id: 4,
                    question: 'What are some beauty tips for men?',
                    answer: 'Establish a simple skincare routine with cleanser and moisturizer, use SPF daily, groom facial hair regularly, stay hydrated, and don\'t neglect eye cream and lip balm.'
                }
            ]
        },
        {
            id: 'nails',
            image: 'https://mavon-beauty.myshopify.com/cdn/shop/files/Frame_4_5e611dac-4734-472b-867b-b96d0ab2bd61.png?v=1686372798&width=750',
            title: 'Collapsible heading',
            questions: [
                {
                    id: 1,
                    question: 'How can I find beauty inspiration?',
                    answer: 'Healthy skin is for people, there\'s a lot of things, they\'re not always aware what it is in the process of using a moisturizer. Arguably the product—'
                },
                {
                    id: 2,
                    question: 'What are some tips for applying nail polish?',
                    answer: 'Start with clean, dry nails. Apply a base coat, then two thin coats of color, and finish with a top coat. Allow each layer to dry completely before applying the next.'
                },
                {
                    id: 3,
                    question: 'What are some tips for taking care of your body?',
                    answer: 'Moisturize daily, exfoliate weekly, drink plenty of water, eat nutritious foods, exercise regularly, get enough sleep, and protect your skin from sun damage.'
                },
                {
                    id: 4,
                    question: 'What are some tips for getting rid of wrinkles?',
                    answer: 'Use retinol products, apply sunscreen daily, keep skin moisturized, get adequate sleep, avoid smoking, stay hydrated, and consider professional treatments like chemical peels or microneedling.'
                }
            ]
        }
    ];
    return (
        <div className="bg-white py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12 text-center mt-5">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">FAQ</h1>
                    <div className="text-sm text-gray-500">
                        <a href="#" className="hover:text-gray-700">Home</a>
                        <span className="mx-2">/</span>
                        <span>FAQ</span>
                    </div>
                </div>
                <div className="space-y-20 mt-20">
                    {faqCards.map((card, index) => (
                        <div key={card.id} className="grid md:grid-cols-2 gap-12 items-start">
                            <div className={index % 2 === 1 ? 'md:order-2' : ''}>
                                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                                    {card.title}
                                </h2>
                                <div className="space-y-1">
                                    {card.questions.map((item) => {
                                        const key = `${card.id}-${item.id}`;
                                        const isOpen = openItems[key];

                                        return (
                                            <div key={item.id} className="border-b border-gray-200">
                                                <button
                                                    onClick={() => toggleItem(card.id, item.id)}
                                                    className="w-full flex justify-between items-center text-left py-4 group"
                                                >
                                                    <span className="text-gray-800 font-bold pr-4 text-[22px]">
                                                        {item.question}
                                                    </span>
                                                    <span className="text-black shrink-0 cursor-pointer">
                                                        {isOpen ? <Minus size={24} /> : <Plus size={24} />}
                                                    </span>
                                                </button>
                                                <div 
                                                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                                                        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                                    }`}
                                                >
                                                    <div className="pb-4 text-gray-500 text-[16px] leading-relaxed">
                                                        {item.answer}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className={index % 2 === 1 ? 'md:order-1' : ''}>
                                <img
                                    src={card.image}
                                    alt={card.title}
                                    className="w-full h-150 object-cover"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
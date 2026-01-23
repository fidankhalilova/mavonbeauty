"use client"
import React, { useState } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, Heart, Lock, Shield, X, Tag, ChevronDown, ChevronUp, Edit2, Check } from 'lucide-react';

interface CartItem {
    id: number;
    name: string;
    model: string;
    hsCode: string;
    quantity: number;
    weight: number;
    perPieceRate: number;
    totalPrice: number;
    color: string;
    deliveryMethod: string;
    description: string;
    isEditingDescription: boolean;
    originalDescription: string;
    showDescription: boolean;
    image: string;
}

export default function BeautyCart() {
    const [cartItems, setCartItems] = useState<CartItem[]>([
        {
            id: 1,
            name: "Hydrating Face Serum",
            model: "Vitamin C Brightening",
            hsCode: "330499",
            quantity: 1,
            weight: 0.05,
            perPieceRate: 89.99,
            totalPrice: 89.99,
            color: "Clear",
            deliveryMethod: "Express",
            description: "Lightweight serum with vitamin C for radiant, glowing skin",
            isEditingDescription: false,
            originalDescription: "",
            showDescription: false,
            image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=150&h=150&fit=crop"
        },
        {
            id: 2,
            name: "Nourishing Night Cream",
            model: "Retinol Advanced",
            hsCode: "330499",
            quantity: 2,
            weight: 0.1,
            perPieceRate: 124.99,
            totalPrice: 249.98,
            color: "White",
            deliveryMethod: "Air",
            description: "Rich night cream with retinol to restore and rejuvenate overnight",
            isEditingDescription: false,
            originalDescription: "",
            showDescription: false,
            image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=150&h=150&fit=crop"
        }
    ]);

    const [shippingMethod, setShippingMethod] = useState<string>("standard");
    const [promoCode, setPromoCode] = useState<string>("");
    const [promoMessage, setPromoMessage] = useState<string>("");
    const [promoValid, setPromoValid] = useState<boolean>(false);
    const [discount, setDiscount] = useState<number>(0);

    const removeItem = (id: number): void => {
        if (confirm('Remove this item from your cart?')) {
            setCartItems(cartItems.filter(item => item.id !== id));
        }
    };

    const clearCart = (): void => {
        if (confirm('Clear your entire cart?')) {
            setCartItems([]);
        }
    };

    const incrementQuantity = (id: number): void => {
        setCartItems(cartItems.map(item => {
            if (item.id === id) {
                const newQuantity = item.quantity + 1;
                return { ...item, quantity: newQuantity, totalPrice: item.perPieceRate * newQuantity };
            }
            return item;
        }));
    };

    const decrementQuantity = (id: number): void => {
        setCartItems(cartItems.map(item => {
            if (item.id === id && item.quantity > 1) {
                const newQuantity = item.quantity - 1;
                return { ...item, quantity: newQuantity, totalPrice: item.perPieceRate * newQuantity };
            }
            return item;
        }));
    };

    const updateQuantity = (id: number, value: string): void => {
        const quantity = Math.max(1, parseInt(value) || 1);
        setCartItems(cartItems.map(item => {
            if (item.id === id) {
                return { ...item, quantity, totalPrice: item.perPieceRate * quantity };
            }
            return item;
        }));
    };

    const toggleDescription = (id: number) => {
        setCartItems(cartItems.map(item =>
            item.id === id ? { ...item, showDescription: !item.showDescription } : item
        ));
    };

    const startEditingDescription = (id: number) => {
        setCartItems(cartItems.map(item =>
            item.id === id ? { ...item, originalDescription: item.description, isEditingDescription: true } : item
        ));
    };

    const saveDescription = (id: number) => {
        setCartItems(cartItems.map(item =>
            item.id === id ? { ...item, isEditingDescription: false } : item
        ));
    };

    const cancelEditingDescription = (id: number) => {
        setCartItems(cartItems.map(item =>
            item.id === id ? { ...item, description: item.originalDescription, isEditingDescription: false } : item
        ));
    };

    const getColorDot = (color: string) => {
        const colorMap = {
            'Clear': 'bg-blue-100 border-2 border-blue-200',
            'White': 'bg-white border-2 border-gray-300',
            'Pink': 'bg-pink-200',
            'Beige': 'bg-amber-100'
        };
        return colorMap[color] || 'bg-gray-200';
    };
    const applyPromoCode = () => {
        const promoCodes = {
            'GLOW20': { discount: 0.2, message: '20% discount applied!' },
            'NEWBEAUTY': { discount: 0.15, message: '15% off your order!' },
            'FREESHIP': { discount: 0, message: 'Free shipping unlocked!', freeShipping: true }
        };

        if (promoCode.trim() === '') {
            setPromoMessage('Please enter a promo code');
            setPromoValid(false);
            return;
        }

        const promo = promoCodes[promoCode.toUpperCase()];
        if (promo) {
            setPromoValid(true);
            setPromoMessage(promo.message);
            if (promo.discount) {
                setDiscount(subtotal * promo.discount);
            }
            if (promo.freeShipping) {
                setShippingMethod('standard');
            }
        } else {
            setPromoValid(false);
            setPromoMessage('Invalid promo code');
            setDiscount(0);
        }
    };

    const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

    const shippingCost = {
        'standard': 5,
        'express': 15,
        'overnight': 25
    }[shippingMethod] || 5;

    const calculateTax = () => (subtotal - discount) * 0.075;
    const total = subtotal + shippingCost + calculateTax() - discount;

    return (
        <div className="min-h-screen bg-white mt-10">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-light text-gray-800 tracking-wide">Shopping Cart</h1>
                    <div className="bg-white shadow-sm px-4 py-2 rounded-full flex items-center gap-2 border border-emerald-100">
                        <ShoppingCart className="w-5 h-5 text-emerald-500" />
                        <span className="font-medium text-gray-700">{cartItems.length}</span>
                        <span className="hidden sm:inline text-gray-600">items</span>
                    </div>
                </div>
                {cartItems.length === 0 && (
                    <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-emerald-100">
                        <ShoppingCart className="w-16 h-16 text-emerald-200 mx-auto mb-4" />
                        <p className="text-xl text-gray-500 mb-6">Your cart is empty</p>
                        <button className="bg-linear-to-r from-emerald-500 to-teal-500 text-white px-8 py-3 rounded-full hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md">
                            Discover Products
                        </button>
                    </div>
                )}
                <div className="sm:hidden space-y-4">
                    {cartItems.map((item) => (
                        <div key={item.id} className="bg-white rounded-2xl shadow-sm p-4 border border-emerald-100">
                            <div className="flex gap-3 mb-4">
                                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl" />
                                <div className="flex-1">
                                    <h3 className="font-medium text-gray-800">{item.name}</h3>
                                    <p className="text-sm text-gray-500">{item.model}</p>
                                    <p className="text-xs text-gray-400 mt-1">HS: {item.hsCode}</p>
                                </div>
                                <button onClick={() => removeItem(item.id)} className="text-rose-400 hover:text-rose-600">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Color:</span>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-4 h-4 rounded-full ${getColorDot(item.color)}`}></div>
                                        <span className="text-gray-700">{item.color}</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Quantity:</span>
                                    <div className="flex items-center gap-2 border border-emerald-200 rounded-full overflow-hidden">
                                        <button onClick={() => decrementQuantity(item.id)} className="px-3 py-1 hover:bg-emerald-50">
                                            <Minus className="w-4 h-4 text-gray-600" />
                                        </button>
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => updateQuantity(item.id, e.target.value)}
                                            className="w-12 text-center border-none focus:outline-none"
                                        />
                                        <button onClick={() => incrementQuantity(item.id)} className="px-3 py-1 hover:bg-emerald-50">
                                            <Plus className="w-4 h-4 text-gray-600" />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex justify-between pt-3 border-t border-emerald-100">
                                    <span className="text-gray-600">Price:</span>
                                    <span className="font-medium text-gray-800">${item.perPieceRate.toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between font-semibold">
                                    <span>Total:</span>
                                    <span className="text-emerald-600">${item.totalPrice.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="hidden sm:block">
                    {cartItems.length > 0 && (
                        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-emerald-100 mb-6">
                            <table className="w-full">
                                <thead className="bg-linear-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
                                    <tr>
                                        <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Product</th>
                                        <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Details</th>
                                        <th className="py-4 px-6 text-center text-sm font-medium text-gray-700">Quantity</th>
                                        <th className="py-4 px-6 text-right text-sm font-medium text-gray-700">Price</th>
                                        <th className="py-4 px-6 text-right text-sm font-medium text-gray-700">Total</th>
                                        <th className="py-4 px-6 text-center text-sm font-medium text-gray-700"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartItems.map((item, idx) => (
                                        <React.Fragment key={item.id}>
                                            <tr className={idx > 0 ? 'border-t border-emerald-100' : ''}>
                                                <td className="py-6 px-6">
                                                    <div className="flex items-center gap-4">
                                                        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl" />
                                                        <div>
                                                            <h3 className="font-medium text-gray-800">{item.name}</h3>
                                                            <p className="text-sm text-gray-500">{item.model}</p>
                                                            <p className="text-xs text-gray-400 mt-1">HS: {item.hsCode}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-6 px-6">
                                                    <div className="space-y-2 text-sm">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-4 h-4 rounded-full ${getColorDot(item.color)}`}></div>
                                                            <span className="text-gray-700">{item.color}</span>
                                                        </div>
                                                        <div className="text-gray-600">{item.weight} kg</div>
                                                        <div className="text-gray-600">{item.deliveryMethod}</div>
                                                    </div>
                                                </td>
                                                <td className="py-6 px-6">
                                                    <div className="flex items-center justify-center gap-2 border border-emerald-200 rounded-full overflow-hidden w-fit mx-auto">
                                                        <button onClick={() => decrementQuantity(item.id)} className="px-3 py-2 hover:bg-emerald-50">
                                                            <Minus className="w-4 h-4 text-gray-600" />
                                                        </button>
                                                        <input
                                                            type="number"
                                                            value={item.quantity}
                                                            onChange={(e) => updateQuantity(item.id, e.target.value)}
                                                            className="w-12 text-center border-none focus:outline-none"
                                                        />
                                                        <button onClick={() => incrementQuantity(item.id)} className="px-3 py-2 hover:bg-emerald-50">
                                                            <Plus className="w-4 h-4 text-gray-600" />
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="py-6 px-6 text-right">
                                                    <span className="font-medium text-gray-800">${item.perPieceRate.toFixed(2)}</span>
                                                </td>
                                                <td className="py-6 px-6 text-right">
                                                    <span className="font-semibold text-emerald-600">${item.totalPrice.toFixed(2)}</span>
                                                </td>
                                                <td className="py-6 px-6 text-center">
                                                    <button onClick={() => removeItem(item.id)} className="text-rose-400 hover:text-rose-600 p-2">
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
                {cartItems.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-2xl shadow-sm p-6 border border-emerald-100">
                                <h2 className="text-lg font-medium text-gray-800 mb-4">Shipping Options</h2>
                                <div className="space-y-3">
                                    {[
                                        { value: 'standard', name: 'Standard Shipping', time: '5-7 business days', price: 5 },
                                        { value: 'express', name: 'Express Shipping', time: '2-3 business days', price: 15 },
                                        { value: 'overnight', name: 'Overnight Shipping', time: 'Next day delivery', price: 25 }
                                    ].map((option) => (
                                        <label key={option.value} className="flex items-center p-4 border border-emerald-100 rounded-xl cursor-pointer hover:bg-emerald-50 transition-colors">
                                            <input
                                                type="radio"
                                                name="shipping"
                                                value={option.value}
                                                checked={shippingMethod === option.value}
                                                onChange={(e) => setShippingMethod(e.target.value)}
                                                className="mr-4 accent-emerald-500"
                                            />
                                            <div className="flex-1">
                                                <div className="font-medium text-gray-800">{option.name}</div>
                                                <div className="text-sm text-gray-500">{option.time}</div>
                                            </div>
                                            <div className="font-semibold text-gray-800">${option.price.toFixed(2)}</div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl shadow-sm p-6 border border-emerald-100">
                                <h2 className="text-lg font-medium text-gray-800 mb-4">Promo Code</h2>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value)}
                                        placeholder="Enter code"
                                        className="flex-1 border border-emerald-200 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                                    />
                                    <button
                                        onClick={applyPromoCode}
                                        className="bg-linear-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-full hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md"
                                    >
                                        Apply
                                    </button>
                                </div>
                                {promoMessage && (
                                    <p className={`mt-3 text-sm ${promoValid ? 'text-emerald-600' : 'text-rose-500'}`}>
                                        {promoMessage}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-sm p-6 border border-emerald-100 sticky top-6">
                                <h2 className="text-xl font-medium text-gray-800 mb-6">Order Summary</h2>
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span className="font-medium">${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping</span>
                                        <span className="font-medium">${shippingCost.toFixed(2)}</span>
                                    </div>
                                    {discount > 0 && (
                                        <div className="flex justify-between text-emerald-600">
                                            <span>Discount</span>
                                            <span className="font-medium">-${discount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-gray-600">
                                        <span>Tax</span>
                                        <span className="font-medium">${calculateTax().toFixed(2)}</span>
                                    </div>
                                    <div className="border-t border-emerald-100 pt-4 mt-4">
                                        <div className="flex justify-between font-semibold text-lg">
                                            <span className="text-gray-800">Total</span>
                                            <span className="text-emerald-600">${total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="w-full bg-linear-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-full font-medium hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md flex items-center justify-center gap-2 mb-4">
                                    <Lock className="w-5 h-5" />
                                    Secure Checkout
                                </button>
                                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                                    <Shield className="w-4 h-4" />
                                    <span>Secure & encrypted</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {cartItems.length > 0 && (
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
                        <button className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
                            ← Continue Shopping
                        </button>
                        <button onClick={clearCart} className="text-gray-400 hover:text-rose-500 transition-colors">
                            <Trash2 className="w-4 h-4 inline mr-2" />
                            Clear Cart
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
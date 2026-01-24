"use client";
import React from "react";

export default function BlogMain() {
  return (
    <div className="w-full bg-white">
      <div className="max-w-7xl mx-auto py-12">
        {/* Header */}
        <h1 className="text-4xl font-bold text-gray-900 mb-12">News</h1>

        {/* Featured Article */}
        <div className="grid md:grid-cols-2 gap-8 items-center mb-24">
          <div className="rounded-3xl overflow-hidden shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1515688594390-b649af70d282?w=800&q=80"
              alt="Natural Beauty Products"
              className="w-full h-100 object-cover"
            />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">
              The 5 Must-Haves for a Natural Beauty Look
            </h2>
            <p className="text-gray-600 leading-relaxed">
              A natural beauty appearance is all about accentuating your natural
              characteristics and looking your best without appearing to be
              overly made up. Here are five essentials for a natural beauty...
            </p>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span>June 2023</span>
              <span className="w-1.5 h-1.5 bg-gray-900 rounded-full"></span>
              <span>Eleyas ahmed</span>
            </div>
            <button className="text-gray-900 font-medium underline underline-offset-4 hover:text-gray-700 transition-colors">
              Read more
            </button>
          </div>
        </div>

        {/* Two Column Articles */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Article 1 */}
          <div className="space-y-4">
            <div className="rounded-3xl overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&q=80"
                alt="Natural Beauty Products"
                className="w-full h-100 object-cover"
              />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              How to Look and Feel Your Best
            </h3>
            <p className="text-gray-600 leading-relaxed">
              It is critical for your entire well-being to look and feel your
              best. You feel good when you look good, and you can do anything
              when you feel good. Here...
            </p>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span>June 2023</span>
              <span className="w-1.5 h-1.5 bg-gray-900 rounded-full"></span>
              <span>Eleyas ahmed</span>
            </div>
          </div>

          {/* Article 2 */}
          <div className="space-y-4">
            <div className="rounded-3xl overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80"
                alt="Self Care"
                className="w-full h-100 object-cover"
              />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              The Importance of Self-Care
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Self-care is the discipline of actively guarding one's own
              well-being and happiness. It entails taking steps to maintain or
              improve one's own health, happiness, physical and mental
              well-being. Self-care is...
            </p>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span>June 2023</span>
              <span className="w-1.5 h-1.5 bg-gray-900 rounded-full"></span>
              <span>Eleyas ahmed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

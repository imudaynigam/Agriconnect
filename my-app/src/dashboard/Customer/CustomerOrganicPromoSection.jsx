import React, { useState, useEffect } from "react";
import { supabase } from '../../utils/supabaseClient';
import { addToCart, getCartItems, removeCartItem, clearCart } from '../../utils/cart';

// Toast component
function Toast({ message, onClose }) {
  const [progress, setProgress] = React.useState(100);
  React.useEffect(() => {
    if (!message) return;
    setProgress(100);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p <= 0) {
          clearInterval(interval);
          onClose();
          return 0;
        }
        return p - 2;
      });
    }, 60); // 60ms * 50 = 3s
    return () => clearInterval(interval);
  }, [message, onClose]);
  if (!message) return null;
  return (
    <div className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50 animate-fade-in min-w-[220px]">
      {message}
      <button onClick={onClose} className="ml-3 text-white font-bold">×</button>
      <div className="w-full h-1 bg-green-800 mt-2 rounded overflow-hidden">
        <div style={{ width: `${progress}%`, transition: 'width 0.06s linear' }} className="h-full bg-white" />
      </div>
    </div>
  );
}

export default function CustomerOrganicPromoSection() {
  // Add to Cart handler
  const handleShopNow = async () => {
    const section = document.getElementById('best-selling-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="pt-8 w-full" style={{ paddingBottom: '4.5rem' }}>
      <div className="bg-yellow-50 rounded-xl flex flex-col md:flex-row items-center justify-between px-4 md:px-16 py-10 w-full">
        {/* Left Image */}
        <img
          src="https://static.vecteezy.com/system/resources/thumbnails/037/296/957/small/ai-generated-green-leaf-logo-free-png.png"
          alt="Green Leaf Logo"
          className="w-32 md:w-44 mb-6 md:mb-0 md:mr-8 object-contain ml-4 md:ml-12"
        />
        {/* Center Text */}
        <div className="flex-1 flex flex-col items-center text-center">
          <span className="text-gray-700 text-sm mb-2">Organic & Garden Fresh</span>
          <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
            Need Organic & quality<br /> product everyday?
          </h2>
          <button onClick={handleShopNow} className="bg-green-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-700 transition flex items-center gap-2">
            Shop Now
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L21 12m0 0l-3.75 5.25M21 12H3" />
            </svg>
          </button>
        </div>
        {/* Right Image */}
        <img
          src="https://img.icons8.com/fluent/512/google-calendar.png"
          alt="Google Calendar"
          className="w-32 md:w-44 mt-6 md:mt-0 md:ml-8 object-contain mr-4 md:mr-12"
        />
      </div>
    </section>
  );
} 
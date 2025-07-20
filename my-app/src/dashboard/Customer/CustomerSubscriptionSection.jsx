import React, { useState } from "react";
import Modal from "../../components/Modal";
import { supabase } from "../../utils/supabaseClient";
import { addToCart } from '../../utils/cart';

const CATEGORY_LIST = [
  "Grains",
  "Pulses",
  "Fruits",
  "Vegetables",
  "Dairy",
  "Spices",
];

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

export default function CustomerSubscriptionSection({ externalModalOpen, externalBasketType, onCloseExternalModal }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [basketType, setBasketType] = useState(null); // 'weekly', 'monthly', or category name
  const [basketProducts, setBasketProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  // Sync with external props
  React.useEffect(() => {
    if (externalModalOpen && externalBasketType) {
      handleGetBasket(externalBasketType);
    }
  }, [externalModalOpen, externalBasketType]);

  const handleGetBasket = async (type) => {
    setBasketType(type);
    setModalOpen(true);
    setLoading(true);
    // Fetch all products
    let { data: products, error } = await supabase
      .from("products")
      .select("*");
    if (error) {
      setBasketProducts([]);
      setLoading(false);
      return;
    }
    let basket = [];
    if (type === 'weekly' || type === 'monthly') {
      // For each category, pick the most recent product
      basket = CATEGORY_LIST.map((cat) =>
        products.filter((p) => (p.category || "").toLowerCase() === cat.toLowerCase())[0]
      ).filter(Boolean);
    } else {
      // For combos, show all products in the selected category
      basket = products.filter((p) => (p.category || '').toLowerCase() === type.toLowerCase());
    }
    setBasketProducts(basket);
    setLoading(false);
  };

  // Calculate subtotal and discount
  const subtotal = basketProducts.reduce((sum, p) => sum + (p?.price || 0), 0);
  let discount = 0.1;
  if (basketType === 'monthly') discount = 0.2;
  if (basketType && !['weekly', 'monthly'].includes(basketType)) discount = 0.07;
  const discountAmount = subtotal * discount;
  const total = subtotal - discountAmount;

  // Add all basket products to cart with discount
  const handleProceedToBuy = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setToast('Please log in to add items to your cart.');
      return;
    }
    if (basketProducts.length === 0) {
      setToast('No products to add.');
      return;
    }
    let hasError = false;
    let addedCount = 0;
    for (const prod of basketProducts) {
      const { error } = await addToCart(user.id, prod.id);
      if (!error) addedCount++;
      if (error) hasError = true;
    }
    if (hasError) {
      setToast('Some items could not be added to cart.');
    } else {
      setToast(`Basket added to cart! Discount applied: ₹${discountAmount.toFixed(2)}`);
      setModalOpen(false);
      if (onCloseExternalModal) onCloseExternalModal();
    }
  };

  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Weekly Subscription */}
          <div className="rounded-2xl bg-yellow-50 p-8 shadow flex aspect-square w-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:border-2 hover:border-green-400 cursor-pointer group">
            <div className="flex flex-col items-start justify-center h-full w-full max-w-[90%] mx-auto">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-gray-700 text-sm font-medium">Exclusive Offer</span>
                <span className="bg-green-600 text-white text-xs font-semibold px-2 py-0.5 rounded">10% OFF</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-5 leading-tight text-left">
                Weekly Farm Fresh<br /> Basket
              </h3>
              <p className="text-gray-600 text-base mb-8 text-left">Only this week... Don't miss. Curated weekly with seasonal produce from local Indian farms. Customizable by category.</p>
              <button
                className="mt-2 bg-green-600 text-white px-6 py-2 rounded-full font-semibold transition-all duration-200 flex items-center gap-2 w-max text-base shadow-md text-left group-hover:bg-green-700 group-hover:scale-105"
                onClick={() => handleGetBasket("weekly")}
              >
                Get Weekly Basket
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L21 12m0 0l-3.75 5.25M21 12H3" />
                </svg>
              </button>
            </div>
          </div>
          {/* Monthly Subscription */}
          <div className="rounded-2xl bg-green-50 p-8 shadow flex aspect-square w-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:border-2 hover:border-green-400 cursor-pointer group">
            <div className="flex flex-col items-start justify-center h-full w-full max-w-[90%] mx-auto">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-gray-700 text-sm font-medium">Regular Offer</span>
                <span className="bg-green-600 text-white text-xs font-semibold px-2 py-0.5 rounded">20% OFF</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-5 leading-tight text-left">
                Monthly Farm Fresh<br /> Basket
              </h3>
              <p className="text-gray-600 text-base mb-8 text-left">Max savings this month. Enjoy a monthly box of the best seasonal produce, handpicked from Indian farms. Customizable by category.</p>
              <button
                className="mt-2 bg-green-600 text-white px-6 py-2 rounded-full font-semibold transition-all duration-200 flex items-center gap-2 w-max text-base shadow-md text-left group-hover:bg-green-700 group-hover:scale-105"
                onClick={() => handleGetBasket("monthly")}
              >
                Get Monthly Basket
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L21 12m0 0l-3.75 5.25M21 12H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Modal for basket */}
      <Modal open={modalOpen} onClose={() => { setModalOpen(false); if (onCloseExternalModal) onCloseExternalModal(); }}>
        <h2 className="text-2xl font-bold mb-4 text-center">
          {basketType === 'weekly' && 'Weekly Basket'}
          {basketType === 'monthly' && 'Monthly Basket'}
          {basketType === 'Fruits' && 'Fruits Combo'}
          {basketType === 'Vegetables' && 'Vegetables Combo'}
          {basketType === 'Dairy' && 'Dairy Combo'}
        </h2>
        {loading ? (
          <div className="text-center py-8 text-lg text-gray-500">Loading basket...</div>
        ) : basketProducts.length === 0 ? (
          <div className="text-center py-8 text-lg text-gray-500">No products available for this basket.</div>
        ) : (
          <div>
            <ul className="divide-y divide-gray-200 mb-4">
              {basketProducts.map((prod) => (
                <li key={prod.id} className="flex items-center gap-4 py-3">
                  <div className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center bg-gray-100">
                    <img src={prod.image_url} alt={prod.name} className="w-full h-full object-cover object-center" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">{prod.name}</div>
                    <div className="text-gray-500 text-sm">{prod.category}</div>
                  </div>
                  <div className="font-bold text-green-700 text-lg">₹{prod.price}</div>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-1 text-right">
              <div className="text-gray-700">Subtotal: <span className="font-semibold">₹{subtotal.toFixed(2)}</span></div>
              <div className="text-gray-700">Discount: <span className="font-semibold">{basketType === 'monthly' ? '20%' : basketType === 'weekly' ? '10%' : '7%'}</span> <span className="text-green-700">-₹{discountAmount.toFixed(2)}</span></div>
              <div className="text-xl font-bold text-green-700 mt-2">Total: ₹{total.toFixed(2)}</div>
            </div>
            <button
              className="mt-6 w-full bg-green-600 text-white py-3 rounded-full font-semibold text-lg hover:bg-green-700 transition"
              onClick={handleProceedToBuy}
            >
              Proceed to Buy Basket
            </button>
          </div>
        )}
      </Modal>
      <Toast message={toast} onClose={() => setToast("")} />
    </section>
  );
} 
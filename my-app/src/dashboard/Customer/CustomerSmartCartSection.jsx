import React, { useState, useEffect } from "react";
import { HeartIcon, ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { supabase } from '../../utils/supabaseClient';
import { addToCart, getCartItems, removeCartItem, clearCart } from '../../utils/cart';
import Modal from '../../components/Modal';

const bundles = [
  {
    name: "Immunity Booster Pack",
    price: 499,
    img: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80",
    desc: "A curated basket of citrus fruits, ginger, and turmeric to boost your immunity. Perfect for health-conscious families.",
    rating: 4.8,
    reviews: 210,
    match: "Immunity Booster Pack"
  },
  {
    name: "Diabetic Friendly Basket",
    price: 399,
    img: "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80",
    desc: "Low GI veggies, whole grains, and pulses for balanced sugar levels. Recommended for diabetic and pre-diabetic customers.",
    rating: 4.7,
    reviews: 180,
    match: "Diabetic Friendly Basket"
  },
  {
    name: "Weekly Veggie Combo",
    price: 299,
    img: "https://images.unsplash.com/photo-1506089676908-3592f7389d4d?auto=format&fit=crop&w=400&q=80",
    desc: "A fresh mix of seasonal vegetables for your weekly needs. Based on your past purchases and current offers!",
    rating: 4.9,
    reviews: 150,
    match: "Weekly Veggie Combo"
  },
  {
    name: "Family Fruit Basket",
    price: 350,
    img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    desc: "A colorful assortment of fruits for the whole family. Great for snacking and lunchboxes.",
    rating: 4.8,
    reviews: 110,
    match: "Family Fruit Basket"
  },
  {
    name: "Weight Loss Essentials",
    price: 420,
    img: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80",
    desc: "Low-calorie, high-fiber foods to support your weight loss journey. Personalized for your eating habits.",
    rating: 4.6,
    reviews: 90,
    match: "Weight Loss Essentials"
  },
];

const COMBO_CATEGORIES = [
  { name: 'Fruits', img: 'https://cdn.pixabay.com/photo/2020/05/08/18/16/healthy-5146826_960_720.jpg' },
  { name: 'Vegetables', img: 'https://cdn.pixabay.com/photo/2017/02/28/20/59/carrots-2106825_960_720.jpg' },
  { name: 'Dairy', img: 'https://cdn.pixabay.com/photo/2016/08/11/23/25/glass-1587258_960_720.jpg' },
];

const CARDS_PER_PAGE = 3;

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

export default function CustomerSmartCartSection({ onCartAdd }) {
  const [page, setPage] = useState(0);
  const [toast, setToast] = useState("");
  const [products, setProducts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const maxPage = Math.ceil(bundles.length / CARDS_PER_PAGE) - 1;
  const start = page * CARDS_PER_PAGE;
  const visible = bundles.slice(start, start + CARDS_PER_PAGE);

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase.from('products').select('*');
      if (!error) setProducts(data);
    }
    fetchProducts();
  }, []);

  // Open modal and fetch products for category
  const handleOpenCombo = async (category) => {
    setSelectedCategory(category);
    setModalOpen(true);
    setLoading(true);
    const filtered = products.filter(p => (p.category || '').toLowerCase() === category.toLowerCase());
    setCategoryProducts(filtered);
    setLoading(false);
  };

  // Calculate subtotal and discount
  const subtotal = categoryProducts.reduce((sum, p) => sum + (p.price || 0), 0);
  const discount = 0.07;
  const discountAmount = subtotal * discount;
  const total = subtotal - discountAmount;

  // Add to Cart handler
  const handleAddToCart = async (bundle) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setToast('Please log in to add items to your cart.');
      return;
    }
    // Try to find a matching product by name
    const match = products.find(p => p.name === bundle.match);
    const productId = match ? match.id : null;
    if (!productId) {
      setToast('Product not found.');
      return;
    }
    const { error } = await addToCart(user.id, productId);
    if (error) {
      setToast('Error adding to cart.');
    } else {
      setToast('Added to cart!');
    }
  };

  // Remove from cart handler (for demo, removes first cart item)
  const handleRemoveFromCart = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await getCartItems(user.id);
    if (data && data.length > 0) {
      await removeCartItem(data[0].id);
      setToast('Removed from cart!');
    }
  };

  // Checkout handler (for demo, clears cart)
  const handleCheckout = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await clearCart(user.id);
    setToast('Thank you for your purchase! (Order system coming soon)');
  };

  // Add all products in the combo to the cart
  const handleAddComboToCart = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setToast('Please log in to add items to your cart.');
      return;
    }
    if (categoryProducts.length === 0) {
      setToast('No products to add.');
      return;
    }
    let hasError = false;
    let addedCount = 0;
    for (const prod of categoryProducts) {
      const { error } = await addToCart(user.id, prod.id);
      if (!error) addedCount++;
      if (error) hasError = true;
    }
    if (onCartAdd && addedCount > 0) onCartAdd(addedCount);
    if (hasError) {
      setToast('Some items could not be added to cart.');
    } else {
      setToast('Combo added to cart!');
      setModalOpen(false);
    }
  };

  // Add all products in a category to the cart (for card button)
  const handleAddComboToCartByCategory = async (category) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setToast('Please log in to add items to your cart.');
      return;
    }
    const filtered = products.filter(p => (p.category || '').toLowerCase() === category.toLowerCase());
    if (filtered.length === 0) {
      setToast('No products to add.');
      return;
    }
    let hasError = false;
    let addedCount = 0;
    for (const prod of filtered) {
      const { error } = await addToCart(user.id, prod.id);
      if (!error) addedCount++;
      if (error) hasError = true;
    }
    if (onCartAdd && addedCount > 0) onCartAdd(addedCount);
    if (hasError) {
      setToast('Some items could not be added to cart.');
    } else {
      setToast('Combo added to cart!');
    }
  };

  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 text-center w-full">Choose The Best Combo</h2>
        </div>
        <div className="flex gap-6 items-stretch">
          {COMBO_CATEGORIES.map((combo, idx) => (
            <div key={combo.name} className="bg-gray-50 rounded-2xl shadow flex flex-col relative w-full max-w-sm min-w-[220px] min-h-[420px] group hover:shadow-lg transition p-0 overflow-hidden cursor-pointer">
              <div className="w-full flex justify-center items-start bg-white rounded-t-2xl h-52 overflow-hidden">
                <img src={combo.img} alt={combo.name} className="w-full h-full object-cover object-center" />
              </div>
              <div className="flex flex-col flex-1 px-5 pt-4 pb-5">
                <div className="flex items-center justify-between w-full mb-1">
                  <h3 className="text-lg font-semibold text-gray-800 text-left">{combo.name} Combo</h3>
                </div>
                <p className="text-gray-500 text-sm mb-2 text-left truncate">Click to view all {combo.name.toLowerCase()} products in this combo pack and get 7% off!</p>
                <div className="flex-1" />
                <div className="flex flex-col gap-2 mt-auto">
                  <button className="bg-green-600 text-white px-4 py-2 rounded-full font-medium hover:bg-green-700 transition text-left" onClick={e => { e.stopPropagation(); handleOpenCombo(combo.name); }}>View Combo</button>
                  <button className="bg-green-700 text-white px-4 py-2 rounded-full font-medium hover:bg-green-900 transition text-left" onClick={async e => { e.stopPropagation(); setLoading(true); await handleAddComboToCartByCategory(combo.name); setLoading(false); }}>Add to Cart</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <h2 className="text-2xl font-bold mb-4 text-center">{selectedCategory} Combo Pack</h2>
          {loading ? (
            <div className="text-center py-8 text-lg text-gray-500">Loading products...</div>
          ) : categoryProducts.length === 0 ? (
            <div className="text-center py-8 text-lg text-gray-500">No products found in this category.</div>
          ) : (
            <div>
              <ul className="divide-y divide-gray-200 mb-4">
                {categoryProducts.map((prod) => (
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
              <div className="flex flex-col gap-1 text-right mb-4">
                <div className="text-gray-700">Subtotal: <span className="font-semibold">₹{subtotal.toFixed(2)}</span></div>
                <div className="text-gray-700">Discount: <span className="font-semibold">7%</span> <span className="text-green-700">-₹{discountAmount.toFixed(2)}</span></div>
                <div className="text-xl font-bold text-green-700 mt-2">Total: ₹{total.toFixed(2)}</div>
              </div>
              <button onClick={handleAddComboToCart} className="w-full bg-green-600 text-white py-3 rounded-full font-semibold text-lg hover:bg-green-700 transition mt-2">Add Combo to Cart</button>
            </div>
          )}
        </Modal>
        <Toast message={toast} onClose={() => setToast("")} />
      </div>
    </section>
  );
} 
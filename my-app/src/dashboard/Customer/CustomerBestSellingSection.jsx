import { useEffect, useState } from 'react';
import { HeartIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { supabase } from '../../utils/supabaseClient';
import { addToCart } from '../../utils/cart';
import React from 'react';

const categories = [
  "All",
  "Grains",
  "Pulses",
  "Fruits",
  "Vegetables",
  "Dairy",
  "Spices",
];

const CARDS_PER_PAGE = 8;

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

export default function CustomerBestSellingSection({ selectedCategory, setSelectedCategory, onCartAdd }) {
  const [products, setProducts] = useState([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      let { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error) setProducts(data);
      console.log('BestSellingSection fetched products:', data);
    };
    fetchProducts();

    // Real-time subscription
    const channel = supabase
      .channel('public:products:best')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        (payload) => {
          fetchProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    setCarouselIndex(0); // Reset carousel when category changes
    console.log('Selected category:', selectedCategory);
  }, [selectedCategory]);

  // Filter by category if not 'All'
  const filtered = selectedCategory === "All"
    ? products
    : products.filter(p => {
        const prodCat = (p.category || '').toLowerCase().trim();
        const selCat = (selectedCategory || '').toLowerCase().trim();
        return prodCat === selCat;
      });
  console.log('Filtered products:', filtered);

  // Paging logic for 'All'
  const maxCarousel = Math.max(0, Math.ceil(filtered.length / CARDS_PER_PAGE) - 1);
  const carouselVisible = filtered.slice(carouselIndex * CARDS_PER_PAGE, (carouselIndex + 1) * CARDS_PER_PAGE);
  // Show only the first 8 as "best selling" for now (for grid)
  const visible = filtered.slice(0, 8);

  // Add to Cart handler
  const handleAddToCart = async (productId) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setToast('Please log in to add items to your cart.');
      return;
    }
    const { error } = await addToCart(user.id, productId);
    if (error) {
      setToast('Error adding to cart.');
    } else {
      setToast('Added to cart!');
      if (onCartAdd) onCartAdd(); // Optimistically update cart count
    }
  };

  return (
    <section id="best-selling-section" className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 text-center">
          Today's Best Selling Product!
        </h2>
        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full border font-medium transition-colors ${selectedCategory === cat ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-green-50'}`}
            >
              {cat}
            </button>
          ))}
        </div>
        {/* Product Cards */}
        {filtered.length === 0 ? (
          <div className="text-center text-gray-500 py-10 text-lg">No products found in this category.</div>
        ) : selectedCategory === 'All' ? (
          <div className="relative">
            <div className="flex items-center mb-2">
              {/* Left Arrow */}
              <button
                onClick={() => setCarouselIndex(i => Math.max(0, i - 1))}
                disabled={carouselIndex === 0}
                className={`rounded-full border w-10 h-10 flex items-center justify-center mr-2 ${carouselIndex === 0 ? 'bg-white text-gray-300 border-gray-200 cursor-not-allowed' : 'bg-white text-green-700 border-gray-300 hover:bg-green-50'}`}
                aria-label="Previous"
              >
                <ChevronLeftIcon className="w-6 h-6" />
              </button>
              <div className="flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
                  {carouselVisible.map((prod, idx) => (
                    <div key={prod.id} className="bg-gray-50 rounded-xl shadow p-4 flex flex-col relative group hover:shadow-lg transition">
                      {/* Wishlist Heart */}
                      <button className="absolute top-3 right-3 text-gray-400 hover:text-red-500">
                        <HeartIcon className="w-6 h-6" />
                      </button>
                      <div className="w-28 h-28 rounded-full overflow-hidden flex items-center justify-center bg-white shadow mb-3 mx-auto">
                        <img src={prod.image_url} alt={prod.name} className="w-full h-full object-cover object-center" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">{prod.name}</h3>
                        <div className="text-green-700 font-bold text-base mb-1">₹{prod.price}</div>
                        <p className="text-gray-500 text-sm mb-2">{prod.description}</p>
                        {/* Rating (placeholder) */}
                        <div className="flex items-center mb-2">
                          <span className="text-yellow-400 mr-1">★</span>
                          <span className="text-sm font-medium text-gray-700 mr-2">4.8</span>
                          <span className="text-xs text-gray-400">(121)</span>
                        </div>
                      </div>
                      <button onClick={() => handleAddToCart(prod.id)} className="mt-2 bg-green-600 text-white px-4 py-2 rounded-full font-medium hover:bg-green-700 transition">Add to Cart</button>
                    </div>
                  ))}
                </div>
              </div>
              {/* Right Arrow */}
              <button
                onClick={() => setCarouselIndex(i => Math.min(maxCarousel, i + 1))}
                disabled={carouselIndex === maxCarousel}
                className={`rounded-full border w-10 h-10 flex items-center justify-center ml-2 ${carouselIndex === maxCarousel ? 'bg-white text-gray-300 border-gray-200 cursor-not-allowed' : 'bg-green-700 text-white border-green-700 hover:bg-green-800'}`}
                aria-label="Next"
              >
                <ChevronRightIcon className="w-6 h-6" />
              </button>
            </div>
            {/* Page Indicator */}
            <div className="text-center text-sm text-gray-500 mt-2">
              {String(carouselIndex + 1).padStart(2, '0')}/{String(maxCarousel + 1).padStart(2, '0')}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
            {visible.map((prod, idx) => (
              <div key={prod.id} className="bg-gray-50 rounded-xl shadow p-4 flex flex-col relative group hover:shadow-lg transition">
                {/* Wishlist Heart */}
                <button className="absolute top-3 right-3 text-gray-400 hover:text-red-500">
                  <HeartIcon className="w-6 h-6" />
                </button>
                <div className="w-28 h-28 rounded-full overflow-hidden flex items-center justify-center bg-white shadow mb-3 mx-auto">
                  <img src={prod.image_url} alt={prod.name} className="w-full h-full object-cover object-center" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{prod.name}</h3>
                  <div className="text-green-700 font-bold text-base mb-1">₹{prod.price}</div>
                  <p className="text-gray-500 text-sm mb-2">{prod.description}</p>
                  {/* Rating (placeholder) */}
                  <div className="flex items-center mb-2">
                    <span className="text-yellow-400 mr-1">★</span>
                    <span className="text-sm font-medium text-gray-700 mr-2">4.8</span>
                    <span className="text-xs text-gray-400">(121)</span>
                  </div>
                </div>
                <button onClick={() => handleAddToCart(prod.id)} className="mt-2 bg-green-600 text-white px-4 py-2 rounded-full font-medium hover:bg-green-700 transition">Add to Cart</button>
              </div>
            ))}
          </div>
        )}
        <Toast message={toast} onClose={() => setToast("")} />
      </div>
    </section>
  );
} 
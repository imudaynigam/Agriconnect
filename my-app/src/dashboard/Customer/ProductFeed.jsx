import { useEffect, useState, useRef } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { addToCart } from '../../utils/cart';
import React from 'react';

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

export default function ProductFeed({ onCartAdd, searchQuery = '' }) {
  const [products, setProducts] = useState([]);
  const [toast, setToast] = useState("");
  const cardRefs = useRef({});

  useEffect(() => {
    const fetchProducts = async () => {
      let { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error) setProducts(data);
      console.log('ProductFeed fetched products:', data);
    };
    fetchProducts();

    // Real-time subscription
    const channel = supabase
      .channel('public:products:feed')
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

  // Listen for scroll-to-product event
  useEffect(() => {
    const handleScrollToProduct = (e) => {
      const id = e.detail;
      if (id && cardRefs.current[id]) {
        cardRefs.current[id].scrollIntoView({ behavior: 'smooth', block: 'center' });
        cardRefs.current[id].classList.add('ring-2', 'ring-green-500');
        setTimeout(() => {
          if (cardRefs.current[id]) cardRefs.current[id].classList.remove('ring-2', 'ring-green-500');
        }, 1200);
      }
    };
    window.addEventListener('scroll-to-product', handleScrollToProduct);
    return () => window.removeEventListener('scroll-to-product', handleScrollToProduct);
  }, []);

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

  // Filter products by search query
  const filteredProducts = products.filter(prod => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (prod.name && prod.name.toLowerCase().includes(q)) ||
      (prod.category && prod.category.toLowerCase().includes(q)) ||
      (prod.description && prod.description.toLowerCase().includes(q))
    );
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
      {filteredProducts.map((prod) => (
        <div
          key={prod.id}
          ref={el => { if (el) cardRefs.current[prod.id] = el; }}
          className="border rounded-lg p-4 bg-white shadow"
        >
          <div className="w-28 h-28 rounded-full overflow-hidden flex items-center justify-center bg-white shadow mb-2 mx-auto">
            <img
              src={prod.image_url}
              alt={prod.name}
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="font-bold text-lg">{prod.name}</div>
          <div className="text-green-700 font-semibold mb-1">₹{prod.price}</div>
          <div className="text-gray-600 text-sm mb-2">{prod.category}</div>
          <div className="text-gray-500 text-sm">{prod.description}</div>
          <button onClick={() => handleAddToCart(prod.id)} className="mt-3 bg-green-600 text-white px-4 py-2 rounded-full font-medium hover:bg-green-700 transition w-full">Add to Cart</button>
        </div>
      ))}
      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
} 
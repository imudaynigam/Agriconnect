import { useEffect, useState } from 'react';
import { getCartItems, updateCartItem, removeCartItem, clearCart } from '../../utils/cart';
import { createOrder, addOrderItems, savePayment, updateOrderPaymentStatus } from '../../utils/orders';
import { supabase } from '../../utils/supabaseClient';
import React from 'react';
import Navigation from '../../nondashboard/Landing/Navigation';
import CustomerFooter from './CustomerFooter';
import CustomerSubscriptionSection from './CustomerSubscriptionSection';
import { useNavigate } from 'react-router-dom';

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

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [checkingOut, setCheckingOut] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [toast, setToast] = useState("");
  const [country, setCountry] = useState("");
  const [stateCity, setStateCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [addressLoading, setAddressLoading] = useState(false);
  const [coupon, setCoupon] = useState(() => localStorage.getItem('cart_coupon_code') || "");
  const [couponApplied, setCouponApplied] = useState(() => localStorage.getItem('cart_coupon_applied') === 'true');
  const [couponError, setCouponError] = useState("");
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
  const [subscriptionType, setSubscriptionType] = useState(null);
  const navigate = useNavigate();

  // Calculate subtotal before any discount logic
  const subtotal = cartItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

  // Combo categories for discount
  const COMBO_CATEGORIES = ['Fruits', 'Vegetables', 'Dairy'];

  // Find all unique products in the cart by category
  const cartProductsByCategory = {};
  cartItems.forEach(item => {
    const cat = (item.product?.category || '').trim();
    if (!cartProductsByCategory[cat]) cartProductsByCategory[cat] = [];
    cartProductsByCategory[cat].push(item);
  });

  // Find all products in the cart (with their categories)
  const allCartProductIds = cartItems.map(item => item.product?.id);

  // Discount logic
  const [allProducts, setAllProducts] = useState([]);
  useEffect(() => {
    async function fetchAllProducts() {
      const { data, error } = await supabase.from('products').select('id,category');
      if (!error) setAllProducts(data);
    }
    fetchAllProducts();
  }, []);

  // Calculate discounts for each combo category
  let comboDiscounts = [];
  let discountedSubtotal = subtotal;
  if (allProducts.length > 0) {
    COMBO_CATEGORIES.forEach(cat => {
      const allCatProducts = allProducts.filter(p => (p.category || '').trim().toLowerCase() === cat.toLowerCase());
      if (allCatProducts.length === 0) return;
      const allCatProductIds = allCatProducts.map(p => p.id);
      // Check if every product in this category is in the cart (at least one quantity)
      const allInCart = allCatProductIds.every(pid => cartItems.some(item => item.product?.id === pid));
      if (allInCart) {
        // Calculate subtotal for this category
        const catSubtotal = cartItems.filter(item => (item.product?.category || '').trim().toLowerCase() === cat.toLowerCase())
          .reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
        const discount = catSubtotal * 0.07;
        comboDiscounts.push({ category: cat, discount, catSubtotal });
        discountedSubtotal -= discount;
      }
    });
  }

  // Coupon logic
  let couponDiscount = 0;
  let finalTotal = discountedSubtotal;
  if (couponApplied) {
    couponDiscount = discountedSubtotal * 0.10;
    finalTotal = discountedSubtotal - couponDiscount;
  }

  useEffect(() => {
    async function fetchUserAndCart() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      setUserId(user.id);
      setUser(user);
      const { data, error } = await getCartItems(user.id);
      setCartItems(data || []);
      setLoading(false);
    }
    fetchUserAndCart();
  }, [checkingOut]);

  // Fetch last saved address for user
  useEffect(() => {
    if (!userId) return;
    async function fetchAddress() {
      setAddressLoading(true);
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);
      if (data && data.length > 0) {
        setCountry(data[0].country || "");
        setStateCity(data[0].state_city || "");
        setZipCode(data[0].zip_code || "");
        setAddressLine(data[0].address_line || "");
      }
      setAddressLoading(false);
    }
    fetchAddress();
  }, [userId]);

  // Save address to Supabase
  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!userId) {
      setToast("Please log in to save your address.");
      return;
    }
    setAddressLoading(true);
    // Insert new address (could also update if you want only one per user)
    const { error } = await supabase.from('addresses').insert([
      {
        user_id: userId,
        country,
        state_city: stateCity,
        zip_code: zipCode,
        address_line: addressLine,
        is_default: true,
      },
    ]);
    setAddressLoading(false);
    if (error) {
      setToast('Error saving address.');
    } else {
      setToast('Address saved!');
    }
  };

  const handleQuantityChange = async (cartItemId, quantity) => {
    await updateCartItem(cartItemId, quantity);
    // Refresh cart
    const { data } = await getCartItems(userId);
    setCartItems(data || []);
  };

  const handleRemove = async (cartItemId) => {
    const { error } = await removeCartItem(cartItemId);
    if (error) {
      setToast('Error removing from cart: ' + (error.message || 'Unknown error'));
    } else {
      const { data } = await getCartItems(userId);
      setCartItems(data || []);
      setToast('Removed from cart!');
    }
  };

  const handleCheckout = async () => {
    setCheckingOut(true);
    await clearCart(userId);
    setCheckingOut(false);
    setToast('Thank you for your purchase! (Order system coming soon)');
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (coupon.trim().toLowerCase() === "agriconnect") {
      setCouponApplied(true);
      setCouponError("");
      setToast("Coupon applied! 10% off");
    } else {
      setCouponApplied(false);
      setCouponError("Invalid coupon code");
      setToast("Invalid coupon code");
    }
  };

  useEffect(() => {
    localStorage.setItem('cart_coupon_code', coupon);
    localStorage.setItem('cart_coupon_applied', couponApplied ? 'true' : 'false');
  }, [coupon, couponApplied]);

  // Razorpay payment handler
  const handleRazorpayCheckout = async () => {
    if (finalTotal <= 0) {
      setToast('Cart total must be greater than zero to checkout.');
      return;
    }
    setPaymentProcessing(true);
    
    try {
      // Create order in database first
      const orderData = {
        subtotal: subtotal,
        comboDiscount: comboDiscounts.reduce((sum, d) => sum + d.discount, 0),
        couponDiscount: couponDiscount,
        deliveryCharges: 0, // You can modify this based on your delivery logic
        totalAmount: finalTotal,
        shippingAddress: {
          country,
          state_city: stateCity,
          zip_code: zipCode,
          address_line: addressLine
        }
      };

      const { data: order, error: orderError } = await createOrder(userId, orderData);
      if (orderError) {
        setToast('Error creating order: ' + orderError.message);
        setPaymentProcessing(false);
        return;
      }

      // Add order items
      const { error: itemsError } = await addOrderItems(order.id, cartItems);
      if (itemsError) {
        setToast('Error adding order items: ' + itemsError.message);
        setPaymentProcessing(false);
        return;
      }

      const options = {
        key: "RAZORPAY_KEY_ID", // TODO: Replace with your Razorpay key ID
        amount: Math.round(finalTotal * 100), // Amount in paise
        currency: "INR",
        name: "Agriconnect",
        description: "Order Payment",
        image: "/logo192.png", // Optional: your logo
        handler: async function (response) {
          try {
            // Save payment details
            const paymentData = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              amount: finalTotal,
              currency: 'INR',
              status: 'captured',
              method: response.method || 'card',
              email: user?.email,
              contact: user?.phone
            };

            const { error: paymentError } = await savePayment(order.id, paymentData);
            if (paymentError) {
              console.error('Error saving payment:', paymentError);
            }

            // Update order status
            await updateOrderPaymentStatus(order.id, 'paid');

            setToast("Payment successful! Order #" + order.order_number + " confirmed.");
            await clearCart(userId);
            setCartItems([]);
          } catch (error) {
            console.error('Error processing payment success:', error);
            setToast("Payment successful but there was an error saving details.");
          } finally {
            setPaymentProcessing(false);
          }
        },
        modal: {
          ondismiss: function() {
            // If payment was cancelled, you might want to update order status
            if (order) {
              updateOrderPaymentStatus(order.id, 'failed').catch(console.error);
            }
            setPaymentProcessing(false);
          }
        },
        prefill: {
          email: user?.email || "",
        },
        theme: {
          color: "#22c55e",
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Error in checkout process:', error);
      setToast('Error processing checkout: ' + error.message);
      setPaymentProcessing(false);
    }
  };

  useEffect(() => {
    // Listen for subscription modal open event
    const handleOpenSubscription = (e) => {
      setSubscriptionType(e.detail);
      setSubscriptionModalOpen(true);
    };
    window.addEventListener('open-subscription-modal', handleOpenSubscription);

    // Listen for footer category scroll/filter event
    const handleFooterCategory = (e) => {
      // Navigate to dashboard and pass selected category
      navigate('/Customer/customer-dashboard', { state: { selectedCategory: e.detail } });
      setTimeout(() => {
        const section = document.getElementById('best-selling-section');
        if (section) section.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    };
    window.addEventListener('select-category', handleFooterCategory);

    return () => {
      window.removeEventListener('open-subscription-modal', handleOpenSubscription);
      window.removeEventListener('select-category', handleFooterCategory);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation showProfile={true} role="customer" logoRedirect="/Customer/customer-dashboard" />
      <section className="py-10 min-h-[60vh] bg-white mt-24 flex-1">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2">Shopping Bag</h2>
          <div className="text-gray-500 mb-8 text-base">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your bag.</div>
          <Toast message={toast} onClose={() => setToast("")} />
          {loading ? (
            <div className="text-center text-gray-500 py-10 text-lg">Loading cart...</div>
          ) : cartItems.length === 0 ? (
            <div className="text-center text-gray-500 py-10 text-lg">Your cart is empty.</div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Cart Items Card/Table */}
              <div className="flex-1 w-full">
                <div className="bg-white rounded-2xl shadow p-6 overflow-x-auto">
                  <div className="grid grid-cols-12 gap-4 pb-4 border-b text-gray-500 font-semibold text-sm">
                    <div className="col-span-5">Product</div>
                    <div className="col-span-2 text-center">Price</div>
                    <div className="col-span-2 text-center">Quantity</div>
                    <div className="col-span-2 text-center">Total Price</div>
                    <div className="col-span-1"></div>
                  </div>
                  {cartItems.map(item => (
                    <div key={item.id} className="grid grid-cols-12 gap-4 items-center py-6 border-b last:border-b-0">
                      <div className="col-span-5 flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden flex items-center justify-center bg-gray-100">
                          <img src={item.product?.image_url} alt={item.product?.name} className="w-full h-full object-cover object-center" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800 text-base">{item.product?.name}</div>
                          <div className="text-xs text-gray-500 mt-1">{item.product?.category}</div>
                        </div>
                      </div>
                      <div className="col-span-2 text-center font-medium text-gray-700">₹{item.product?.price?.toFixed(2)}</div>
                      <div className="col-span-2 flex justify-center items-center gap-2">
                        <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)} className="px-2 py-1 bg-gray-200 rounded text-lg font-bold">-</button>
                        <span className="px-3">{item.quantity}</span>
                        <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)} className="px-2 py-1 bg-gray-200 rounded text-lg font-bold">+</button>
                      </div>
                      <div className="col-span-2 text-center font-semibold text-yellow-500">₹{((item.product?.price || 0) * item.quantity).toFixed(2)}</div>
                      <div className="col-span-1 flex justify-end">
                        <button onClick={() => handleRemove(item.id)} className="text-red-500 text-xs hover:underline">Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Summary Card */}
              <div className="w-full lg:w-[340px] flex-shrink-0">
                <div className="bg-white rounded-2xl shadow p-6 mb-6">
                  <div className="font-semibold text-gray-800 mb-4">Calculated Shipping</div>
                  <div className="flex flex-col gap-2 mb-4">
                    <select className="border rounded px-3 py-2 text-sm text-gray-600" value={country} onChange={e => setCountry(e.target.value)} disabled={addressLoading}>
                      <option value="">Country</option>
                      <option value="India">India</option>
                      <option value="Other">Other</option>
                    </select>
                    <select className="border rounded px-3 py-2 text-sm text-gray-600" value={stateCity} onChange={e => setStateCity(e.target.value)} disabled={addressLoading}>
                      <option value="">State / City</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Bangalore">Bangalore</option>
                      <option value="Other">Other</option>
                    </select>
                    <input className="border rounded px-3 py-2 text-sm text-gray-600" placeholder="ZIP Code" value={zipCode} onChange={e => setZipCode(e.target.value)} disabled={addressLoading} />
                    <textarea className="border rounded px-3 py-2 text-sm text-gray-600" placeholder="Complete Address" rows={2} value={addressLine} onChange={e => setAddressLine(e.target.value)} disabled={addressLoading} />
                    <button className="bg-gray-200 text-gray-700 rounded px-4 py-2 font-semibold mt-2" onClick={handleSaveAddress} disabled={addressLoading}>{addressLoading ? 'Saving...' : 'Update'}</button>
                  </div>
                  <div className="font-semibold text-gray-800 mb-2 mt-6">Coupon Code</div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-green-600 text-white text-xs font-semibold px-2 py-0.5 rounded">AGRICONNECT</span>
                    <span className="text-xs text-gray-700">- 10% INSTANT Discount.</span>
                  </div>
                  <form className="flex flex-col gap-2 mb-4" onSubmit={handleApplyCoupon}>
                    <input className="border rounded px-3 py-2 text-sm text-gray-600" placeholder="Coupon Code" value={coupon} onChange={e => setCoupon(e.target.value)} disabled={couponApplied} />
                    <button type="submit" className="bg-gray-200 text-gray-700 rounded px-4 py-2 font-semibold" disabled={couponApplied}>{couponApplied ? 'Applied' : 'Apply'}</button>
                    {couponError && <div className="text-xs text-red-500">{couponError}</div>}
                  </form>
                  {couponApplied && <div className="text-xs text-green-700 mb-4">Coupon applied: 10% off</div>}
                  <div className="bg-yellow-100 rounded-xl p-4 mt-4">
                    <div className="flex justify-between items-center text-gray-700 mb-2">
                      <span>Cart Subtotal</span>
                      <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-700 mb-2">
                      <span>Delivery Charges</span>
                      <span className="font-semibold">Free</span>
                    </div>
                    {comboDiscounts.length > 0 && (
                      <>
                        {comboDiscounts.map((d, i) => (
                          <div key={d.category} className="flex justify-between items-center text-green-700 font-semibold mb-1">
                            <div className="flex flex-col">
                              <span>{d.category} Combo Discount</span>
                              <span className="text-xs font-normal">(7%)</span>
                            </div>
                            <span>-₹{d.discount.toFixed(2)}</span>
                          </div>
                        ))}
                      </>
                    )}
                    {couponApplied && (
                      <div className="flex justify-between items-center text-green-700 font-semibold mb-1">
                        <span>Coupon Discount (10%)</span>
                        <span>-₹{couponDiscount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-xl font-bold text-green-800 mt-2">
                      <span>Cart Total</span>
                      <span>₹{finalTotal.toFixed(2)}</span>
                    </div>
                    <button
                      className="w-full bg-yellow-400 text-gray-900 py-3 rounded-full font-semibold text-lg hover:bg-yellow-500 transition mt-4 shadow"
                      onClick={handleRazorpayCheckout}
                      disabled={checkingOut || paymentProcessing}
                    >
                      {checkingOut ? 'Processing...' : paymentProcessing ? 'Opening Payment...' : 'Checkout'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Info Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            <div className="bg-white rounded-xl shadow flex items-center gap-4 p-4">
              <div className="bg-pink-100 rounded-full p-2"><svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" /></svg></div>
              <div>
                <div className="font-semibold text-gray-800 text-sm">Free Shipping</div>
                <div className="text-xs text-gray-500">When you spend ₹500+</div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow flex items-center gap-4 p-4">
              <div className="bg-yellow-100 rounded-full p-2"><svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m0 4v12m0 0H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4m0 12h4a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2H9" /></svg></div>
              <div>
                <div className="font-semibold text-gray-800 text-sm">Call Us Anytime</div>
                <div className="text-xs text-gray-500">+91 5555 5555</div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow flex items-center gap-4 p-4">
              <div className="bg-green-100 rounded-full p-2"><svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8a9 9 0 1 1 18 0z" /></svg></div>
              <div>
                <div className="font-semibold text-gray-800 text-sm">Chat With Us</div>
                <div className="text-xs text-gray-500">24-hour chat support</div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow flex items-center gap-4 p-4">
              <div className="bg-yellow-100 rounded-full p-2"><svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a5 5 0 0 0-10 0v2a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2z" /></svg></div>
              <div>
                <div className="font-semibold text-gray-800 text-sm">Gift Cards</div>
                <div className="text-xs text-gray-500">For your loved ones, in any amount</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <CustomerSubscriptionSection 
        externalModalOpen={subscriptionModalOpen}
        externalBasketType={subscriptionType}
        onCloseExternalModal={() => setSubscriptionModalOpen(false)}
      />
      <CustomerFooter />
    </div>
  );
} 
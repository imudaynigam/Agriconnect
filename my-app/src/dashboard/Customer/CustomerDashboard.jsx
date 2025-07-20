import Navigation from '../../nondashboard/Landing/Navigation';
import CustomerHeroSection from './CustomerHeroSection';
import CustomerCategorySection from './CustomerCategorySection';
import CustomerBestSellingSection from './CustomerBestSellingSection';
import CustomerSubscriptionSection from './CustomerSubscriptionSection';
import CustomerSmartCartSection from './CustomerSmartCartSection';
import CustomerOrganicPromoSection from './CustomerOrganicPromoSection';
import CustomerFeaturesBar from './CustomerFeaturesBar';
import CustomerFooter from './CustomerFooter';
import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { getCartItems } from '../../utils/cart';

export default function CustomerDashboard() {
  const [cartItemCount, setCartItemCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
  const [subscriptionType, setSubscriptionType] = useState(null);

  useEffect(() => {
    let userId = null;
    let channel = null;
    async function fetchCartCount() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setCartItemCount(0);
        return;
      }
      userId = user.id;
      const { data, error } = await getCartItems(userId);
      if (data) {
        const count = data.reduce((sum, item) => sum + (item.quantity || 0), 0);
        setCartItemCount(count);
      } else {
        setCartItemCount(0);
      }
    }
    fetchCartCount();
    // Real-time subscription
    channel = supabase
      .channel('public:cart_items:dashboard')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'cart_items' },
        (payload) => {
          console.log('Supabase cart_items subscription payload:', payload);
          fetchCartCount();
        }
      )
      .subscribe();
    // Listen for footer category scroll/filter event
    const handleFooterCategory = (e) => {
      setSelectedCategory(e.detail);
    };
    window.addEventListener('select-category', handleFooterCategory);
    // Listen for subscription modal open event
    const handleOpenSubscription = (e) => {
      setSubscriptionType(e.detail);
      setSubscriptionModalOpen(true);
    };
    window.addEventListener('open-subscription-modal', handleOpenSubscription);
    // Listen for dashboard-search event
    const handleDashboardSearch = (e) => {
      setSearchQuery(e.detail || '');
    };
    window.addEventListener('dashboard-search', handleDashboardSearch);
    // Listen for cart-item-added event (optimistic cart count update)
    const handleCartItemAdded = (e) => {
      setCartItemCount((c) => c + (e.detail || 1));
    };
    window.addEventListener('cart-item-added', handleCartItemAdded);
    return () => {
      if (channel) supabase.removeChannel(channel);
      window.removeEventListener('select-category', handleFooterCategory);
      window.removeEventListener('open-subscription-modal', handleOpenSubscription);
      window.removeEventListener('dashboard-search', handleDashboardSearch);
      window.removeEventListener('cart-item-added', handleCartItemAdded);
    };
  }, []);

  // Optimistically update cart count
  const handleCartAdd = (count = 1) => setCartItemCount((c) => c + count);

  return (
    <>
      <Navigation showProfile={true} role="customer" cartItemCount={cartItemCount} searchQuery={searchQuery} onSearchChange={setSearchQuery} logoRedirect="/Customer/customer-dashboard" isDashboard={true} />
      <div className="pt-24"> {/* Add padding to avoid navbar overlap */}
        <CustomerHeroSection />
        <CustomerCategorySection selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
        <CustomerBestSellingSection selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} onCartAdd={handleCartAdd} />
        <CustomerSubscriptionSection 
          externalModalOpen={subscriptionModalOpen}
          externalBasketType={subscriptionType}
          onCloseExternalModal={() => setSubscriptionModalOpen(false)}
        />
        <CustomerSmartCartSection onCartAdd={handleCartAdd} />
        <CustomerOrganicPromoSection />
        <CustomerFeaturesBar />
      </div>
      <CustomerFooter />
    </>
  );
}

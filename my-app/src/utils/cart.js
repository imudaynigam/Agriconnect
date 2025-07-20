import { supabase } from './supabaseClient';

// Add a product to the cart (insert or increment quantity)
export async function addToCart(userId, productId) {
  // Check if item already in cart
  const { data: existing, error: fetchError } = await supabase
    .from('cart_items')
    .select('*')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .single();
  if (fetchError && fetchError.code !== 'PGRST116') return { error: fetchError };
  if (existing) {
    // Increment quantity
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity: existing.quantity + 1 })
      .eq('id', existing.id);
    return { error };
  } else {
    // Insert new cart item
    const { error } = await supabase
      .from('cart_items')
      .insert([{ user_id: userId, product_id: productId, quantity: 1 }]);
    return { error };
  }
}

// Get all cart items for a user (with product details)
export async function getCartItems(userId) {
  return await supabase
    .from('cart_items')
    .select('*, product:product_id(*)')
    .eq('user_id', userId);
}

// Update quantity for a cart item
export async function updateCartItem(cartItemId, quantity) {
  if (quantity < 1) return removeCartItem(cartItemId);
  return await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', cartItemId);
}

// Remove a cart item
export async function removeCartItem(cartItemId) {
  return await supabase
    .from('cart_items')
    .delete()
    .eq('id', cartItemId);
}

// Clear all cart items for a user
export async function clearCart(userId) {
  return await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', userId);
} 
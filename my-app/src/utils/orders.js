import { supabase } from './supabaseClient';

// Create a new order
export async function createOrder(userId, orderData) {
  const { data, error } = await supabase
    .from('orders')
    .insert([{
      user_id: userId,
      subtotal: orderData.subtotal,
      combo_discount: orderData.comboDiscount,
      coupon_discount: orderData.couponDiscount,
      delivery_charges: orderData.deliveryCharges,
      total_amount: orderData.totalAmount,
      shipping_address: orderData.shippingAddress,
      status: 'pending',
      payment_status: 'pending'
    }])
    .select()
    .single();

  return { data, error };
}

// Add items to an order
export async function addOrderItems(orderId, items) {
  const orderItems = items.map(item => ({
    order_id: orderId,
    product_id: item.product.id,
    product_name: item.product.name,
    product_price: item.product.price,
    quantity: item.quantity,
    total_price: item.product.price * item.quantity
  }));

  const { data, error } = await supabase
    .from('order_items')
    .insert(orderItems)
    .select();

  return { data, error };
}

// Save payment details
export async function savePayment(orderId, paymentData) {
  const { data, error } = await supabase
    .from('payments')
    .insert([{
      order_id: orderId,
      razorpay_payment_id: paymentData.razorpay_payment_id,
      razorpay_order_id: paymentData.razorpay_order_id,
      amount: paymentData.amount,
      currency: paymentData.currency || 'INR',
      status: paymentData.status || 'captured',
      payment_method: paymentData.method,
      bank: paymentData.bank,
      wallet: paymentData.wallet,
      vpa: paymentData.vpa,
      email: paymentData.email,
      contact: paymentData.contact,
      fee: paymentData.fee,
      tax: paymentData.tax,
      error_code: paymentData.error_code,
      error_description: paymentData.error_description
    }])
    .select()
    .single();

  return { data, error };
}

// Update order payment status
export async function updateOrderPaymentStatus(orderId, status) {
  const { data, error } = await supabase
    .from('orders')
    .update({ 
      payment_status: status,
      status: status === 'paid' ? 'confirmed' : 'pending'
    })
    .eq('id', orderId)
    .select()
    .single();

  return { data, error };
}

// Get user's orders
export async function getUserOrders(userId) {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        product:product_id (*)
      ),
      payments (*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return { data, error };
}

// Get a specific order with details
export async function getOrder(orderId, userId) {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        product:product_id (*)
      ),
      payments (*)
    `)
    .eq('id', orderId)
    .eq('user_id', userId)
    .single();

  return { data, error };
} 
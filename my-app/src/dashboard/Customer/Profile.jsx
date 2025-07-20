import React, { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { getUserOrders } from '../../utils/orders';
import { UserIcon, BellIcon, MapPinIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import Navigation from '../../nondashboard/Landing/Navigation';

const CARD_BG = 'bg-white';
const PAGE_BG = 'bg-white';
const TEXT_MAIN = 'text-gray-900';
const TEXT_SUB = 'text-gray-500';
const ACCENT = 'text-green-600';

const tabList = [
  { key: 'profile', label: 'Profile', icon: <UserIcon className="w-5 h-5 mr-2" /> },
  { key: 'addresses', label: 'Saved Addresses', icon: <MapPinIcon className="w-5 h-5 mr-2" /> },
  { key: 'orders', label: 'Order History', icon: <ShoppingBagIcon className="w-5 h-5 mr-2" /> },
  { key: 'notifications', label: 'Notifications', icon: <BellIcon className="w-5 h-5 mr-2" /> },
];

function Sidebar({ tab, setTab }) {
  return (
    <aside className="hidden md:flex flex-col w-56 min-h-[calc(100vh-64px)] bg-white border-r border-gray-200 py-8 px-4 fixed top-16 left-0 z-30">
      <div className="mb-8 text-2xl font-bold text-green-700 pl-2">Account</div>
      <nav className="flex flex-col gap-2">
        {tabList.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center px-4 py-3 rounded-lg font-medium text-lg transition-all duration-150 text-left ${tab === t.key ? 'bg-green-600 text-white shadow' : 'text-gray-700 hover:bg-green-50 hover:text-green-700'}`}
          >
            {t.icon}{t.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

function ProfileDetails({ user, onChange, onSave, loading }) {
  return (
    <div className={`rounded-2xl p-8 mb-8 w-full ${CARD_BG}`}>  
      <h3 className="text-xl font-bold mb-6 text-gray-900">Profile Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block mb-2 text-gray-700 font-medium">First name</label>
          <input type="text" className="w-full rounded-lg bg-gray-50 border border-gray-300 px-4 py-2 text-gray-900 focus:border-green-500 outline-none" value={user.firstName} onChange={e => onChange('firstName', e.target.value)} />
        </div>
        <div>
          <label className="block mb-2 text-gray-700 font-medium">Last name</label>
          <input type="text" className="w-full rounded-lg bg-gray-50 border border-gray-300 px-4 py-2 text-gray-900 focus:border-green-500 outline-none" value={user.lastName} onChange={e => onChange('lastName', e.target.value)} />
        </div>
        <div>
          <label className="block mb-2 text-gray-700 font-medium">Email</label>
          <input type="email" className="w-full rounded-lg bg-gray-50 border border-gray-300 px-4 py-2 text-gray-900 focus:border-green-500 outline-none" value={user.email} disabled />
        </div>
        <div>
          <label className="block mb-2 text-gray-700 font-medium">Role</label>
          <input type="text" className="w-full rounded-lg bg-gray-50 border border-gray-300 px-4 py-2 text-gray-900 focus:border-green-500 outline-none" value={user.role} disabled />
        </div>
      </div>
      <button onClick={onSave} disabled={loading} className="mt-2 bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition">{loading ? 'Saving...' : 'Save Changes'}</button>
    </div>
  );
}

function SavedAddresses({ userId }) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editFields, setEditFields] = useState({ country: '', state_city: '', zip_code: '', address_line: '' });
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [addFields, setAddFields] = useState({ country: '', state_city: '', zip_code: '', address_line: '', is_default: false });
  const [addLoading, setAddLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    async function fetchAddresses() {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      setAddresses(data || []);
      setLoading(false);
    }
    fetchAddresses();
  }, [userId, actionLoading, addLoading]);

  // Edit handlers
  const startEdit = (addr) => {
    setEditId(addr.id);
    setEditFields({
      country: addr.country || '',
      state_city: addr.state_city || '',
      zip_code: addr.zip_code || '',
      address_line: addr.address_line || '',
    });
  };
  const cancelEdit = () => {
    setEditId(null);
    setEditFields({ country: '', state_city: '', zip_code: '', address_line: '' });
  };
  const handleEditChange = (field, value) => {
    setEditFields(f => ({ ...f, [field]: value }));
  };
  const saveEdit = async (id) => {
    setActionLoading(true);
    const { error } = await supabase.from('addresses').update(editFields).eq('id', id);
    setActionLoading(false);
    if (error) setToast('Error updating address.');
    else setToast('Address updated!');
    setEditId(null);
  };
  // Delete handler
  const deleteAddress = async (id) => {
    if (!window.confirm('Delete this address?')) return;
    setActionLoading(true);
    const { error } = await supabase.from('addresses').delete().eq('id', id);
    setActionLoading(false);
    if (error) setToast('Error deleting address.');
    else setToast('Address deleted!');
  };
  // Set default handler
  const setDefault = async (id) => {
    setActionLoading(true);
    // Unset all, then set this one
    await supabase.from('addresses').update({ is_default: false }).eq('user_id', userId);
    const { error } = await supabase.from('addresses').update({ is_default: true }).eq('id', id);
    setActionLoading(false);
    if (error) setToast('Error setting default.');
    else setToast('Default address set!');
  };

  // Add address handler
  const handleAddChange = (field, value) => {
    setAddFields(f => ({ ...f, [field]: value }));
  };
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      setToast('Please log in to add an address.');
      return;
    }
    setAddLoading(true);
    // If set as default, unset all others first
    if (addFields.is_default) {
      await supabase.from('addresses').update({ is_default: false }).eq('user_id', userId);
    }
    const { error } = await supabase.from('addresses').insert([
      {
        user_id: userId,
        country: addFields.country,
        state_city: addFields.state_city,
        zip_code: addFields.zip_code,
        address_line: addFields.address_line,
        is_default: !!addFields.is_default,
      },
    ]);
    setAddLoading(false);
    if (error) setToast('Error adding address.');
    else {
      setToast('Address added!');
      setAddFields({ country: '', state_city: '', zip_code: '', address_line: '', is_default: false });
    }
  };

  return (
    <div className={`rounded-2xl p-8 w-full ${CARD_BG}`}>  
      <h3 className="text-xl font-bold mb-6 text-gray-900 flex items-center"><MapPinIcon className="w-6 h-6 mr-2 text-green-600" />Saved Addresses</h3>
      {/* Add Address Form */}
      <form className="mb-8 bg-gray-50 border border-gray-200 rounded-lg p-4" onSubmit={handleAddSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
          <input className="border rounded px-3 py-2 text-sm w-full" value={addFields.address_line} onChange={e => handleAddChange('address_line', e.target.value)} placeholder="Complete Address" required />
          <input className="border rounded px-3 py-2 text-sm w-full" value={addFields.state_city} onChange={e => handleAddChange('state_city', e.target.value)} placeholder="State / City" required />
          <input className="border rounded px-3 py-2 text-sm w-full" value={addFields.zip_code} onChange={e => handleAddChange('zip_code', e.target.value)} placeholder="ZIP Code" required />
          <input className="border rounded px-3 py-2 text-sm w-full" value={addFields.country} onChange={e => handleAddChange('country', e.target.value)} placeholder="Country" required />
        </div>
        <div className="flex items-center gap-3 mb-2">
          <input type="checkbox" id="add-default" checked={addFields.is_default} onChange={e => handleAddChange('is_default', e.target.checked)} />
          <label htmlFor="add-default" className="text-sm text-gray-700">Set as default</label>
        </div>
        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded font-semibold hover:bg-green-700 transition" disabled={addLoading}>{addLoading ? 'Adding...' : 'Add Address'}</button>
      </form>
      {toast && (
        <div className="mb-4 text-green-700 bg-green-50 border border-green-200 rounded px-4 py-2">{toast}</div>
      )}
      {loading ? (
        <div className="text-gray-500">Loading addresses...</div>
      ) : addresses.length === 0 ? (
        <div className="text-gray-500">No saved addresses found.</div>
      ) : (
        <div className="space-y-6">
          {addresses.map(addr => (
            <div key={addr.id} className={`border rounded-lg p-4 ${addr.is_default ? 'border-green-600 bg-green-50' : 'border-gray-200 bg-gray-50'}`}> 
              {editId === addr.id ? (
                <div className="space-y-2">
                  <input className="border rounded px-3 py-2 text-sm w-full" value={editFields.address_line} onChange={e => handleEditChange('address_line', e.target.value)} placeholder="Complete Address" />
                  <input className="border rounded px-3 py-2 text-sm w-full" value={editFields.state_city} onChange={e => handleEditChange('state_city', e.target.value)} placeholder="State / City" />
                  <input className="border rounded px-3 py-2 text-sm w-full" value={editFields.zip_code} onChange={e => handleEditChange('zip_code', e.target.value)} placeholder="ZIP Code" />
                  <input className="border rounded px-3 py-2 text-sm w-full" value={editFields.country} onChange={e => handleEditChange('country', e.target.value)} placeholder="Country" />
                  <div className="flex gap-2 mt-2">
                    <button className="bg-green-600 text-white px-4 py-1 rounded" onClick={() => saveEdit(addr.id)} disabled={actionLoading}>Save</button>
                    <button className="bg-gray-200 text-gray-700 px-4 py-1 rounded" onClick={cancelEdit} disabled={actionLoading}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">{addr.address_line}</span>
                    {addr.is_default && <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-green-600 text-white font-semibold">Default</span>}
                  </div>
                  <div className="text-gray-500 text-sm">{addr.state_city}, {addr.zip_code}</div>
                  <div className="text-gray-700 text-sm">{addr.country}</div>
                  <div className="flex gap-2 mt-2">
                    <button className="text-green-700 hover:underline" onClick={() => startEdit(addr)} disabled={actionLoading}>Edit</button>
                    <button className="text-red-500 hover:underline" onClick={() => deleteAddress(addr.id)} disabled={actionLoading}>Delete</button>
                    {!addr.is_default && <button className="text-blue-600 hover:underline" onClick={() => setDefault(addr.id)} disabled={actionLoading}>Set Default</button>}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function OrderHistory({ userId }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    async function fetchOrders() {
      const { data, error } = await getUserOrders(userId);
      if (error) {
        console.error('Error fetching orders:', error);
      } else {
        setOrders(data || []);
      }
      setLoading(false);
    }
    fetchOrders();
  }, [userId]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div className={`rounded-2xl p-8 w-full ${CARD_BG}`}>
      <h3 className="text-xl font-bold mb-6 text-gray-900 flex items-center">
        <ShoppingBagIcon className="w-6 h-6 mr-2 text-green-600" />
        Order History
      </h3>
      
      {loading ? (
        <div className="text-gray-500 text-center py-8">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-gray-500 text-center py-8">
          <ShoppingBagIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">No orders found</p>
          <p className="text-sm">Your order history will appear here once you make your first purchase.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Order Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">{order.order_number}</h4>
                      <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.payment_status)}`}>
                        {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="font-semibold text-gray-900">₹{order.total_amount.toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => toggleOrderExpansion(order.id)}
                      className="text-green-600 hover:text-green-700 font-medium text-sm"
                    >
                      {expandedOrder === order.id ? 'Hide Details' : 'View Details'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Details (Expandable) */}
              {expandedOrder === order.id && (
                <div className="px-6 py-4 bg-white">
                  {/* Order Items */}
                  <div className="mb-6">
                    <h5 className="font-semibold text-gray-900 mb-3">Order Items</h5>
                    <div className="space-y-3">
                      {order.order_items?.map(item => (
                        <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
                            {item.product?.image_url ? (
                              <img src={item.product.image_url} alt={item.product_name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-gray-400 text-xs">No Image</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.product_name}</p>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">₹{item.total_price.toFixed(2)}</p>
                            <p className="text-sm text-gray-500">₹{item.product_price.toFixed(2)} each</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="mb-6">
                    <h5 className="font-semibold text-gray-900 mb-3">Order Summary</h5>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium">₹{order.subtotal.toFixed(2)}</span>
                      </div>
                      {order.combo_discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Combo Discount:</span>
                          <span>-₹{order.combo_discount.toFixed(2)}</span>
                        </div>
                      )}
                      {order.coupon_discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Coupon Discount:</span>
                          <span>-₹{order.coupon_discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Delivery Charges:</span>
                        <span className="font-medium">₹{order.delivery_charges.toFixed(2)}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                        <span>Total:</span>
                        <span>₹{order.total_amount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  {order.shipping_address && (
                    <div className="mb-6">
                      <h5 className="font-semibold text-gray-900 mb-3">Shipping Address</h5>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-900">{order.shipping_address.address_line}</p>
                        <p className="text-gray-600">{order.shipping_address.state_city}, {order.shipping_address.zip_code}</p>
                        <p className="text-gray-600">{order.shipping_address.country}</p>
                      </div>
                    </div>
                  )}

                  {/* Payment Details */}
                  {order.payments && order.payments.length > 0 && (
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-3">Payment Details</h5>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">Payment ID:</span>
                          <span className="font-mono text-sm">{order.payments[0].razorpay_payment_id}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">Payment Method:</span>
                          <span className="font-medium">{order.payments[0].payment_method || 'Card'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payment Date:</span>
                          <span>{formatDate(order.payments[0].created_at)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Profile() {
  const [user, setUser] = useState({ firstName: '', lastName: '', email: '', role: '', avatar_url: '' });
  const [tab, setTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Split name for demo; adjust as needed
        const nameParts = (user.user_metadata?.name || '').split(' ');
        setUser({
          firstName: nameParts[0] || '',
          lastName: nameParts[1] || '',
          email: user.email,
          role: user.user_metadata?.role || '',
          avatar_url: user.user_metadata?.avatar_url || '',
        });
        setUserId(user.id);
      }
    }
    fetchUser();
  }, []);

  const handleChange = (field, value) => {
    setUser(u => ({ ...u, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    const updates = { name: `${user.firstName} ${user.lastName}` };
    const { error } = await supabase.auth.updateUser({ data: updates });
    setLoading(false);
    // Optionally show a toast or reload user
  };

  return (
    <div className={`min-h-screen w-full ${PAGE_BG}`}>
      <Navigation showProfile={true} role="customer" logoRedirect="/Customer/customer-dashboard" />
      <div className="flex pt-20">
        <Sidebar tab={tab} setTab={setTab} />
        <main className="flex-1 px-4 md:ml-64 pl-0">
          <div className="flex flex-col w-full">
            {tab === 'profile' && (
              <>
                <div className="flex items-center gap-6 mb-10 mt-8 ml-6">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-green-600 bg-gray-100 flex items-center justify-center">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl font-bold text-green-600">{user.firstName?.[0] || user.email?.[0]}</span>
                    )}
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold text-gray-900">Account Settings</div>
                    <div className="text-gray-500">Manage your account settings and preferences</div>
                  </div>
                </div>
                <div className="w-full"><ProfileDetails user={user} onChange={handleChange} onSave={handleSave} loading={loading} /></div>
              </>
            )}
            {tab === 'addresses' && <div className="w-full"><SavedAddresses userId={userId} /></div>}
            {tab === 'orders' && <div className="w-full"><OrderHistory userId={userId} /></div>}
            {tab === 'notifications' && (
              <div className={`rounded-2xl p-8 ${CARD_BG} text-gray-400 text-center text-lg w-full`}>
                <span>No new notifications</span>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
} 
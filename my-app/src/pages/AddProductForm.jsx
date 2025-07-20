import { useState, useEffect } from 'react';
import supabase from "../supabaseClient";
import AnimationBackgroundElement from "../nondashboard/Landing/AnimationBackgroundElement";
import { PlusCircleIcon } from '@heroicons/react/24/outline';

export default function AddProductForm() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    category: ''
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
      } else {
        console.log("Fetched user:", data.user);
        setUser(data.user);
      }
      setInitialLoading(false);
    };
    getUser();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!user || !user.id) {
      setMessage('❌ User not found. Please log in.');
      setLoading(false);
      return;
    }

    const { name, description, price, image_url, category } = form;

    const { data, error } = await supabase.from('products').insert([{
      name,
      description,
      price: parseFloat(price),
      image_url,
      category,
      created_by: user.id
    }]);

    console.log("Supabase insert result:", { data, error });

    setLoading(false);

    if (error) {
      setMessage('❌ ' + error.message);
    } else {
      setMessage('✅ Product added successfully!');
      setForm({ name: '', description: '', price: '', image_url: '', category: '' });
    }
  };

  if (initialLoading) {
    return (
      <div className="text-center p-10 text-gray-500">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center p-10 text-red-600">
        ❌ You must be logged in to add products.
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-white flex justify-center items-center px-4 py-10 overflow-hidden">
      <AnimationBackgroundElement />

      <div className="w-full max-w-2xl mx-auto bg-white p-10 rounded-2xl shadow-2xl relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <PlusCircleIcon className="w-8 h-8 text-green-600" />
          <h2 className="text-3xl font-bold text-gray-800">Add New Product</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 text-gray-700">Product Name</label>
            <input
              name="name"
              placeholder="e.g. Organic Wheat"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700">Price</label>
            <input
              name="price"
              placeholder="e.g. 150"
              value={form.price}
              onChange={handleChange}
              required
              type="number"
              step="0.01"
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700">Image URL</label>
            <input
              name="image_url"
              placeholder="https://example.com/image.jpg"
              value={form.image_url}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700">Category</label>
            <input
              name="category"
              placeholder="e.g. Grains, Vegetables"
              value={form.category}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700">Description</label>
            <textarea
              name="description"
              placeholder="Write a short description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg transition-colors text-lg font-medium"
          >
            {loading ? 'Adding...' : 'Add Product'}
          </button>

          {message && (
            <div className={`mt-4 text-base font-medium ${message.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
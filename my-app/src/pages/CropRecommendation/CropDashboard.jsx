import React, { useState } from "react";
import cropData, { locationOptions, seasonOptions } from "./cropData";

const CropDashboard = () => {
  const [form, setForm] = useState({ state: "", city: "", season: "" });
  const [recommendations, setRecommendations] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "state" ? { city: "" } : {}),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitted(false);
    setRecommendations([]);

    setTimeout(() => {
      const filtered = cropData.filter((crop) => {
        return (
          crop.state.toLowerCase() === form.state.toLowerCase() &&
          crop.city.toLowerCase() === form.city.toLowerCase() &&
          crop.season.toLowerCase() === form.season.toLowerCase()
        );
      });

      setRecommendations(filtered);
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-white">
      {/* Form Container */}
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 border border-green-600">
        <h2 className="text-3xl font-bold text-green-700 mb-6">
          Crop Recommendation
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-green-800 mb-1">State</label>
            <select
              name="state"
              value={form.state}
              onChange={handleInput}
              required
              className="w-full border border-green-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="">Select State</option>
              {Object.keys(locationOptions).map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-green-800 mb-1">City</label>
            <select
              name="city"
              value={form.city}
              onChange={handleInput}
              required
              disabled={!form.state}
              className="w-full border border-green-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50"
            >
              <option value="">Select City</option>
              {form.state &&
                locationOptions[form.state].map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-green-800 mb-1">Season</label>
            <select
              name="season"
              value={form.season}
              onChange={handleInput}
              required
              className="w-full border border-green-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="">Select Season</option>
              {seasonOptions.map((season) => (
                <option key={season} value={season}>{season}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg shadow-md transition-transform transform hover:scale-105"
          >
            Get Recommendations
          </button>
        </form>
      </div>

      {/* Recommendations */}
      <div className="w-full max-w-6xl mt-12 grid grid-cols-1 ">
        {loading && (
          <div className="col-span-full flex flex-col items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-500 mb-4"></div>
            <p className="text-green-700 text-lg">Analyzing location and season... 🌿</p>
          </div>
        )}

        {submitted && recommendations.length === 0 && !loading && (
          <p className="col-span-full text-center text-red-600 text-lg">
            ❌ No crops found for your inputs. Try a different combination.
          </p>
        )}

        {!loading &&
          recommendations.map((crop, i) => (
            <div
              key={i}
              className="flex flex-col justify-between w-full max-w-[320px] bg-white border border-green-600 rounded-2xl shadow-lg p-6 min-h-[320px] mx-auto transition-transform transform hover:scale-105"
            >
              <h3 className="text-xl font-bold text-green-700 mb-3">{crop.name}</h3>
              <p className="text-gray-700 mb-1">
                <strong>Region:</strong> {crop.city}, {crop.state}
              </p>
              <p className="text-gray-700 mb-1">
                <strong>Season:</strong> {crop.season}
              </p>
              <p className="text-gray-700 mb-1">
                <strong>Soil Type:</strong> {crop.soil}
              </p>
              <p className="text-gray-700 mb-1">
                <strong>Expected Yield:</strong> {crop.yield}
              </p>
              <p className="text-gray-700 mb-1">
                <strong>Market Price:</strong> {crop.price}
              </p>
              <p className="text-gray-700">
                <strong>Profit Level:</strong> {crop.profit}
              </p>
            </div>
          ))}
      </div>
    </section>
  );
};

export default CropDashboard;
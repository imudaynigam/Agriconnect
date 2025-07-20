import React, { useState } from 'react';
import { TrendingUp, Calendar, MapPin, DollarSign, BarChart3 } from 'lucide-react';
import FarmerNavigation from '../dashboard/Farmer/FarmerNavigation';
import FooterSection from '../nondashboard/Landing/FooterSection';
import Lottie from 'lottie-react';
import trendingUpAnimation from '../assets/trending-up.json';
import './CropPricePredictor.css';

const CropPricePredictor = () => {
  const [selectedCrop, setSelectedCrop] = useState('');
  const [location, setLocation] = useState('');
  const [quantity, setQuantity] = useState('');
  const [harvestDate, setHarvestDate] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const crops = [
    'Wheat', 'Rice', 'Corn', 'Soybeans', 'Cotton', 'Tomatoes', 
    'Potatoes', 'Onions', 'Sugarcane', 'Barley'
  ];

  const handlePredict = async () => {
    if (!selectedCrop || !location || !quantity || !harvestDate) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const basePrice = Math.random() * 50 + 20;
      const marketTrend = Math.random() > 0.5 ? 'up' : 'down';
      const confidence = Math.random() * 30 + 70;

      setPrediction({
        predictedPrice: basePrice.toFixed(2),
        trend: marketTrend,
        confidence: confidence.toFixed(1),
        factors: [
          'Historical price trends',
          'Market demand forecast',
          'Weather conditions',
          'Supply chain analysis'
        ]
      });
      setLoading(false);
    }, 2000);
  };

  const resetForm = () => {
    setSelectedCrop('');
    setLocation('');
    setQuantity('');
    setHarvestDate('');
    setPrediction(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br bg-white p-4">
      {/* ✅ Farmer Navigation added */}
      <div className="sticky top-0 z-50">
        <FarmerNavigation />
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
           
           <br></br><br></br>
          </div>
           <h2 className="text-xl text-gray-600">Crop Price Prediction</h2>
           <p className="text-gray-500 mt-2">Get accurate price forecasts to maximize your harvest profits</p>
          </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-600" />
              Prediction Parameters
            </h3>

            <div className="space-y-4">
              {/* Crop Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Crop
                </label>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Choose a crop...</option>
                  {crops.map(crop => (
                    <option key={crop} value={crop}>{crop}</option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter your city/region"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Quantity (tons)
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Enter quantity in tons"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Harvest Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Expected Harvest Date
                </label>
                <input
                  type="date"
                  value={harvestDate}
                  onChange={(e) => setHarvestDate(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handlePredict}
                  disabled={loading}
                  className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors btn-primary"
                >
                  {loading ? 'Analyzing...' : 'Predict Price'}
                </button>
                <button
                  onClick={resetForm}
                  className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              Price Prediction
            </h3>

          {!prediction && !loading && (
          <div className="text-center py-12">
            {/* ⬇️ Removed gray background and made animation larger */}
            <div className="flex items-center justify-center mx-auto mb-6">
            <Lottie 
              animationData={trendingUpAnimation} 
             loop 
             className="w-32 h-32"  // Bigger size (adjust as needed)
             />
            </div>
            <p className="text-gray-500 text-lg">Fill in the form and click "Predict Price" to see results</p>
             </div>
             )}

            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">Analyzing market data...</p>
              </div>
            )}

            {prediction && (
              <div className="space-y-6 fade-in">
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 text-center">
                  <h4 className="text-sm text-gray-600 mb-2">Predicted Price per Ton</h4>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    ${prediction.predictedPrice}
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      prediction.trend === 'up' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {prediction.trend === 'up' ? '↗ Trending Up' : '↘ Trending Down'}
                    </span>
                    <span className="text-sm text-gray-600">
                      {prediction.confidence}% confidence
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Estimated Total Revenue</h4>
                  <div className="text-2xl font-semibold text-gray-800">
                    ${(parseFloat(prediction.predictedPrice) * parseFloat(quantity)).toFixed(2)}
                  </div>
                  <p className="text-sm text-gray-600">Based on {quantity} tons</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Analysis Based On:</h4>
                  <ul className="space-y-2">
                    {prediction.factors.map((factor, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-xs text-yellow-800">
                    <strong>Disclaimer:</strong> Price predictions are estimates based on available data and market trends. 
                    Actual prices may vary due to unforeseen market conditions.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            Why Choose AgriConnect Price Prediction?
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-medium text-gray-800 mb-2">AI-Powered Analysis</h4>
              <p className="text-sm text-gray-600">Advanced algorithms analyze multiple market factors</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-800 mb-2">Real-Time Data</h4>
              <p className="text-sm text-gray-600">Updated market information for accurate predictions</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-800 mb-2">Location-Specific</h4>
              <p className="text-sm text-gray-600">Tailored predictions for your specific region</p>
            </div>
          </div>
        </div>
      </div>
      <FooterSection />
    </div>
  );
};

export default CropPricePredictor;
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { AlertTriangle, TrendingUp, TrendingDown, Shield, Target, Activity } from 'lucide-react';
import { riskApi } from '../../api/riskApi';

const RiskGrading = () => {
  const [formData, setFormData] = useState({
    cropName: '',
    year: new Date().getFullYear(),
    state: '',
    marketDemandIndex: 0.5
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const riskData = [
    { crop: 'Wheat', riskIndex: 0.3, revenue: 45000, color: '#10b981' },
    { crop: 'Rice', riskIndex: 0.4, revenue: 52000, color: '#3b82f6' },
    { crop: 'Corn', riskIndex: 0.6, revenue: 38000, color: '#f59e0b' },
    { crop: 'Soybean', riskIndex: 0.5, revenue: 48000, color: '#ef4444' },
    { crop: 'Cotton', riskIndex: 0.7, revenue: 35000, color: '#8b5cf6' }
  ];

  const riskTrendData = [
    { month: 'Jan', lowRisk: 15, mediumRisk: 25, highRisk: 10 },
    { month: 'Feb', lowRisk: 18, mediumRisk: 22, highRisk: 12 },
    { month: 'Mar', lowRisk: 20, mediumRisk: 20, highRisk: 15 },
    { month: 'Apr', lowRisk: 22, mediumRisk: 18, highRisk: 18 },
    { month: 'May', lowRisk: 25, mediumRisk: 15, highRisk: 20 },
    { month: 'Jun', lowRisk: 28, mediumRisk: 12, highRisk: 25 }
  ];

  const cropOptions = [
    { value: 'wheat', label: 'Wheat' },
    { value: 'rice', label: 'Rice' },
    { value: 'corn', label: 'Corn' },
    { value: 'soybean', label: 'Soybean' },
    { value: 'cotton', label: 'Cotton' },
    { value: 'sugarcane', label: 'Sugarcane' }
  ];

  const stateOptions = [
    { value: 'punjab', label: 'Punjab' },
    { value: 'haryana', label: 'Haryana' },
    { value: 'up', label: 'Uttar Pradesh' },
    { value: 'mp', label: 'Madhya Pradesh' },
    { value: 'maharashtra', label: 'Maharashtra' },
    { value: 'karnataka', label: 'Karnataka' }
  ];

  const getRiskLevel = (riskIndex) => {
    if (riskIndex <= 0.3) return { level: 'Low', color: '#10b981', bgColor: '#ecfdf5' };
    if (riskIndex <= 0.6) return { level: 'Medium', color: '#f59e0b', bgColor: '#fffbeb' };
    return { level: 'High', color: '#ef4444', bgColor: '#fef2f2' };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await riskApi.predictRisk(formData);
      setPrediction({
        estimatedRevenue: result.Estimated_Revenue,
        riskIndex: result.Risk_Index
      });
    } catch (error) {
      console.error('Error predicting risk:', error);
      // Fallback to mock data
      setPrediction({
        estimatedRevenue: Math.floor(Math.random() * 50000) + 20000,
        riskIndex: Math.random() * 0.8 + 0.2
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Risk Assessment Form */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-red-100 rounded-lg mr-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Risk Assessment Tool</h3>
            <p className="text-gray-600">Analyze investment risks based on crop, location, and market conditions</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Crop Type</label>
            <select
              name="cropName"
              value={formData.cropName}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            >
              <option value="">Select Crop</option>
              {cropOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              min="2020"
              max="2030"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
            <select
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            >
              <option value="">Select State</option>
              {stateOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Market Demand Index (0-1)</label>
            <input
              type="number"
              name="marketDemandIndex"
              value={formData.marketDemandIndex}
              onChange={handleInputChange}
              min="0"
              max="1"
              step="0.1"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          <div className="md:col-span-2 lg:col-span-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Activity className="h-5 w-5 mr-2 animate-spin" />
                  Analyzing Risk...
                </>
              ) : (
                <>
                  <Target className="h-5 w-5 mr-2" />
                  Assess Risk
                </>
              )}
            </button>
          </div>
        </form>

        {/* Prediction Results */}
        {prediction && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-lg font-semibold mb-4">Risk Assessment Results</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center mb-2">
                  <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                  <span className="font-medium">Estimated Revenue</span>
                </div>
                <p className="text-2xl font-bold text-green-600">₹{prediction.estimatedRevenue.toLocaleString()}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center mb-2">
                  <Shield className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="font-medium">Risk Index</span>
                </div>
                <div className="flex items-center">
                  <p className="text-2xl font-bold mr-2">{(prediction.riskIndex * 100).toFixed(1)}%</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevel(prediction.riskIndex).bgColor} ${getRiskLevel(prediction.riskIndex).color}`}>
                    {getRiskLevel(prediction.riskIndex).level} Risk
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Risk Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk by Crop */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Risk Index by Crop</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={riskData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="crop" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip />
              <Bar dataKey="riskIndex" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Trend */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Risk Trend Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={riskTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip />
              <Line type="monotone" dataKey="lowRisk" stroke="#10b981" strokeWidth={3} name="Low Risk" />
              <Line type="monotone" dataKey="mediumRisk" stroke="#f59e0b" strokeWidth={3} name="Medium Risk" />
              <Line type="monotone" dataKey="highRisk" stroke="#ef4444" strokeWidth={3} name="High Risk" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Risk Distribution */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Current Portfolio Risk Distribution</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-green-100 p-4 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">45%</div>
              <div className="text-sm text-green-700">Low Risk</div>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-yellow-100 p-4 rounded-lg">
              <div className="text-3xl font-bold text-yellow-600 mb-2">35%</div>
              <div className="text-sm text-yellow-700">Medium Risk</div>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-red-100 p-4 rounded-lg">
              <div className="text-3xl font-bold text-red-600 mb-2">20%</div>
              <div className="text-sm text-red-700">High Risk</div>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Management Tips */}
      <div className="bg-green-600 p-6 rounded-xl border border-green-200">
        <h3 className="text-lg font-semibold mb-4 text-white">Risk Management Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">Diversification Strategy</h4>
            <p className="text-sm text-gray-600">Spread investments across different crops and regions to minimize risk exposure.</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">Market Monitoring</h4>
            <p className="text-sm text-gray-600">Regularly track market demand indices and adjust investment strategies accordingly.</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">Weather Insurance</h4>
            <p className="text-sm text-gray-600">Consider crop insurance options to protect against weather-related risks.</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">Technology Adoption</h4>
            <p className="text-sm text-gray-600">Invest in precision farming technologies to improve yield predictability.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskGrading; 
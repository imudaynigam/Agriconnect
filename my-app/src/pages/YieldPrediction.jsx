import { useState } from 'react';
import React from 'react';
import './YieldPrediction.css';
import FarmerNavigation from '../dashboard/Farmer/FarmerNavigation';
import FooterSection from '../nondashboard/Landing/FooterSection';
import { Leaf, Wheat,  Sun, CloudRain, Sprout, } from 'lucide-react';
import { FaTractor } from 'react-icons/fa';

export default function YieldPrediction() {
  const [formData, setFormData] = useState({
    crop: '',
    soilQuality: '',
    rainfall: '',
    temperature: '',
    inputMethod: ''
  });
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const prepareModelData = () => {
    return {
      crop_type: formData.crop,
      soil_quality: formData.soilQuality,
      rainfall_mm: parseFloat(formData.rainfall),
      temperature_celsius: parseFloat(formData.temperature),
      farming_method: formData.inputMethod,
      timestamp: new Date().toISOString()
    };
  };

  const handleSubmit = async () => {
    if (!formData.crop || !formData.soilQuality || !formData.rainfall || 
        !formData.temperature || !formData.inputMethod) {
      alert('Please fill all fields before predicting');
      return;
    }

    setIsLoading(true);

    try {
      const modelData = prepareModelData();
      console.log('Data ready for ML model:', modelData);
      setTimeout(() => {
        const demoYield = Math.random() * 50 + 30;
        setPrediction(demoYield.toFixed(1));
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Prediction error:', error);
      alert('Error getting prediction. Please try again.');
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  return (
    <div className="main-container">
      {/* ✅ Header */}
      <div className="sticky top-0 z-50">
        <FarmerNavigation />
      </div>

      <div className="app-container">
        <div className="header-section">
          <br /><br />
          <p className="subtitle font-bold text-black text-lg md:text-xl">
            Connecting farmers with smart predictions
          </p>
        </div>

        <div className="main-card">
          <div className="card-header">
            <h2><Sprout className="inline w-5 h-5 mr-2" /> Farm Parameters</h2>
          </div>

          <div className="card-body">
            {/* Crop Selection */}
            <div className="form-group">
              <label className="form-label">Crop Type</label>
              <div className="input-wrapper">
            
                <select 
                  name="crop" 
                  value={formData.crop}
                  onChange={handleChange}
                  className="form-select crop-input"
                >
                  <option value="">Select your crop</option>
                  <option value="wheat">Wheat</option>
                  <option value="rice">Rice</option>
                  <option value="corn">Corn</option>
                  <option value="soybean">Soybean</option>
                </select>
              </div>
            </div>

            {/* Soil Quality */}
            <div className="form-group">
              <label className="form-label">Soil Quality</label>
              <div className="input-wrapper">
               
                <select 
                  name="soilQuality"
                  value={formData.soilQuality}
                  onChange={handleChange}
                  className="form-select soil-input"
                >
                  <option value="">Select soil quality</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="average">Average</option>
                  <option value="poor">Poor</option>
                </select>
              </div>
            </div>

            {/* Rainfall */}
            <div className="form-group">
              <label className="form-label">Expected Rainfall (mm)</label>
              <div className="input-wrapper">
                <CloudRain className="input-icon text-blue-600" />
                <input 
                  type="number"
                  name="rainfall"
                  value={formData.rainfall}
                  onChange={handleChange}
                  className="form-input rain-input"
                  placeholder="Enter rainfall amount"
                />
              </div>
            </div>

            {/* Temperature */}
            <div className="form-group">
              <label className="form-label">Average Temperature (°C)</label>
              <div className="input-wrapper">
                <Sun className="input-icon text-red-600" />
                <input 
                  type="number"
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleChange}
                  className="form-input temp-input"
                  placeholder="Enter temperature"
                />
              </div>
            </div>

            {/* Input Method */}
            <div className="form-group">
              <label className="form-label">Farming Method</label>
              <div className="input-wrapper">
              
                <select 
                  name="inputMethod"
                  value={formData.inputMethod}
                  onChange={handleChange}
                  className="form-select method-input"
                >
                  <option value="">Select method</option>
                  <option value="organic">Organic</option>
                  <option value="conventional">Conventional</option>
                  <option value="precision">Precision Agriculture</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              onClick={handleSubmit}
              disabled={isLoading}
              className="submit-btn"
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Analyzing...
                </>
              ) : (
                <>Predict My Yield</>
              )}
            </button>
          </div>
        </div>

        {/* Prediction Result */}
        {prediction && (
          <div className="result-card">
            <div className="result-content">
              <h3 className="result-title">Predicted Yield</h3>
              <div className="result-value">{prediction}</div>
              <div className="result-unit">tons per hectare</div>
              <p className="result-description">
                Powered by AgriConnect's smart farming technology
              </p>
              <div className="result-tags">
                <span>AgriConnect Analytics</span>
                <span>Precision Farming Insights</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ✅ Footer */}
      <FooterSection />
    </div>
  );
}
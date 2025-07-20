import React, { useState, useEffect } from 'react';
import { TestTube2, Leaf, BarChart3, AlertTriangle, CheckCircle2, Info, TrendingUp, Calendar, MapPin } from 'lucide-react';

// API Configuration
const API_CONFIG = {
  url: 'https://api.ambeedata.com/soil/latest/by-lat-lng',
  key: '2a047a842c93a9020e1e59899978120c783721bd99cc0f5dbf01f347b191944d'
};


// Enhanced recommendations generator with improved logic
const generateAdvancedRecommendations = (data) => {
  const ph = parseFloat(data.ph);
  const n = parseFloat(data.nitrogen);
  const p = parseFloat(data.phosphorus);
  const k = parseFloat(data.potassium);
  const om = data.organicMatter ? parseFloat(data.organicMatter) : null;
  const moisture = data.moisture ? parseFloat(data.moisture) : null;
  
  let recommendations = [];
  let cropSuggestions = [];
  let soilIssues = [];
  let seasonalTips = [];
  
  // Enhanced pH recommendations with more detailed guidance
  if (ph < 5.5) {
    recommendations.push({
      type: 'pH Management - Critical',
      action: 'Apply agricultural lime immediately',
      priority: 'Critical',
      amount: `${Math.round((6.5 - ph) * 800)} lbs/acre`,
      explanation: 'Extremely acidic soil prevents nutrient uptake',
      timeline: '2-3 months before planting'
    });
    soilIssues.push('Severe acidity limiting nutrient availability');
  } else if (ph < 6.0) {
    recommendations.push({
      type: 'pH Management',
      action: 'Apply lime to raise soil pH',
      priority: 'High',
      amount: `${Math.round((6.5 - ph) * 600)} lbs/acre`,
      explanation: 'Acidic conditions reduce phosphorus availability',
      timeline: '4-6 weeks before planting'
    });
  } else if (ph > 8.0) {
    recommendations.push({
      type: 'pH Management',
      action: 'Apply elemental sulfur to lower pH',
      priority: 'High',
      amount: `${Math.round((ph - 7.0) * 300)} lbs/acre`,
      explanation: 'Alkaline soil reduces iron and zinc availability',
      timeline: '6-8 weeks before planting'
    });
    soilIssues.push('High alkalinity affecting micronutrient availability');
  }

  // Enhanced nutrient recommendations with timing
  if (n < 15) {
    recommendations.push({
      type: 'Nitrogen - Primary',
      action: 'Apply nitrogen fertilizer in split applications',
      priority: 'Critical',
      amount: `${Math.round((25 - n) * 3)} lbs N/acre`,
      explanation: 'Severe nitrogen deficiency will limit plant growth',
      timeline: 'Apply 1/2 at planting, 1/2 at mid-season'
    });
  } else if (n < 25) {
    recommendations.push({
      type: 'Nitrogen',
      action: 'Apply moderate nitrogen fertilizer',
      priority: 'High',
      amount: `${Math.round((30 - n) * 2)} lbs N/acre`,
      explanation: 'Boost nitrogen for optimal leaf development',
      timeline: 'Apply at planting'
    });
  }

  if (p < 10) {
    recommendations.push({
      type: 'Phosphorus - Primary',
      action: 'Apply high-phosphorus starter fertilizer',
      priority: 'Critical',
      amount: `${Math.round((20 - p) * 4)} lbs P2O5/acre`,
      explanation: 'Low phosphorus severely impacts root development',
      timeline: 'Apply 2 weeks before planting'
    });
  } else if (p < 20) {
    recommendations.push({
      type: 'Phosphorus',
      action: 'Apply phosphate fertilizer',
      priority: 'Medium',
      amount: `${Math.round((25 - p) * 3)} lbs P2O5/acre`,
      explanation: 'Adequate phosphorus supports flowering and fruiting',
      timeline: 'Apply at planting'
    });
  }

  if (k < 80) {
    recommendations.push({
      type: 'Potassium - Primary',
      action: 'Apply potash fertilizer',
      priority: 'High',
      amount: `${Math.round((120 - k) * 2)} lbs K2O/acre`,
      explanation: 'Low potassium reduces disease resistance',
      timeline: 'Apply in fall or early spring'
    });
  } else if (k < 120) {
    recommendations.push({
      type: 'Potassium',
      action: 'Apply maintenance potash',
      priority: 'Medium',
      amount: `${Math.round((140 - k) * 1.5)} lbs K2O/acre`,
      explanation: 'Maintain potassium for plant vigor',
      timeline: 'Apply before planting'
    });
  }

  // Organic matter recommendations
  if (om !== null) {
    if (om < 2.0) {
      recommendations.push({
        type: 'Organic Matter',
        action: 'Add compost or organic amendments',
        priority: 'High',
        amount: '2-4 tons/acre annually',
        explanation: 'Low organic matter reduces water retention and nutrient cycling',
        timeline: 'Apply in fall or early spring'
      });
      soilIssues.push('Low organic matter affecting soil structure');
    } else if (om < 3.0) {
      seasonalTips.push('Consider cover crops to maintain organic matter levels');
    }
  }

  // Moisture-based recommendations
  if (moisture !== null) {
    if (moisture < 15) {
      seasonalTips.push('Improve irrigation scheduling - soil appears dry');
      soilIssues.push('Low soil moisture may stress plants');
    } else if (moisture > 80) {
      seasonalTips.push('Monitor drainage - high moisture may indicate poor drainage');
      soilIssues.push('High moisture levels may indicate drainage issues');
    }
  }

  // Enhanced crop suggestions with soil-specific reasoning
  if (ph >= 6.0 && ph <= 7.0 && n >= 20 && p >= 15 && k >= 100) {
    cropSuggestions = [
      { name: 'Corn', suitability: 'Excellent', reason: 'Optimal pH and high nutrient levels' },
      { name: 'Soybeans', suitability: 'Excellent', reason: 'Good pH and nutrient balance' },
      { name: 'Wheat', suitability: 'Very Good', reason: 'Suitable pH and adequate nutrients' },
      { name: 'Tomatoes', suitability: 'Good', reason: 'pH suitable, may need additional nutrients' }
    ];
  } else if (ph >= 5.5 && ph <= 6.5) {
    cropSuggestions = [
      { name: 'Potatoes', suitability: 'Excellent', reason: 'Prefers slightly acidic soil' },
      { name: 'Blueberries', suitability: 'Excellent', reason: 'Thrives in acidic conditions' },
      { name: 'Carrots', suitability: 'Good', reason: 'Tolerates moderate acidity' },
      { name: 'Sweet Potatoes', suitability: 'Good', reason: 'Adaptable to soil conditions' }
    ];
  } else if (ph < 5.5) {
    cropSuggestions = [
      { name: 'Blueberries', suitability: 'Good', reason: 'Acid-tolerant crop' },
      { name: 'Cranberries', suitability: 'Good', reason: 'Prefers very acidic soil' },
      { name: 'Azaleas', suitability: 'Good', reason: 'Ornamental acid-lover' }
    ];
  } else {
    cropSuggestions = [
      { name: 'Barley', suitability: 'Good', reason: 'Tolerates alkaline conditions' },
      { name: 'Sugar Beets', suitability: 'Good', reason: 'Performs well in alkaline soil' },
      { name: 'Alfalfa', suitability: 'Very Good', reason: 'Prefers slightly alkaline soil' }
    ];
  }

  // Calculate enhanced health score
  let healthScore = 0;
  let maxScore = 100;

  // pH scoring (25 points)
  if (ph >= 6.0 && ph <= 7.5) healthScore += 25;
  else if (ph >= 5.5 && ph <= 8.0) healthScore += 15;
  else if (ph >= 5.0 && ph <= 8.5) healthScore += 5;

  // Nutrient scoring (60 points total - 20 each)
  if (n >= 25) healthScore += 20;
  else if (n >= 15) healthScore += 15;
  else if (n >= 10) healthScore += 5;

  if (p >= 20) healthScore += 20;
  else if (p >= 15) healthScore += 15;
  else if (p >= 10) healthScore += 10;

  if (k >= 120) healthScore += 20;
  else if (k >= 100) healthScore += 15;
  else if (k >= 80) healthScore += 10;

  // Organic matter bonus (15 points)
  if (om !== null) {
    if (om >= 4.0) healthScore += 15;
    else if (om >= 3.0) healthScore += 10;
    else if (om >= 2.0) healthScore += 5;
  }

  const overallHealth = healthScore >= 85 ? 'Excellent' : 
                       healthScore >= 65 ? 'Good' : 
                       healthScore >= 45 ? 'Fair' : 'Poor';

  return {
    overallHealth,
    healthScore,
    recommendations,
    cropSuggestions,
    soilIssues,
    seasonalTips,
    analysis_date: new Date().toISOString()
  };
};

const SoilHealthAnalyzer = () => {
  const [inputMethod, setInputMethod] = useState('manual');
  const [soilData, setSoilData] = useState({
    ph: '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    organicMatter: '',
    moisture: ''
  });
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('recommendations');

  const handleInputChange = (field, value) => {
    setSoilData(prev => ({
      ...prev,
      [field]: value
    }));
    if (error) setError(null);
  };

  const validateSoilData = () => {
    const required = ['ph', 'nitrogen', 'phosphorus', 'potassium'];
    const missing = required.filter(field => !soilData[field]);
    
    if (missing.length > 0) {
      setError(`Please fill in required fields: ${missing.join(', ')}`);
      return false;
    }

    const ph = parseFloat(soilData.ph);
    if (ph < 3 || ph > 11) {
      setError('pH should be between 3.0 and 11.0');
      return false;
    }

    const n = parseFloat(soilData.nitrogen);
    if (n < 0 || n > 200) {
      setError('Nitrogen should be between 0 and 200 ppm');
      return false;
    }

    return true;
  };

  const callSoilAnalysisAPI = async (data) => {
    try {
      const response = await fetch(API_CONFIG.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_CONFIG.key}`,
          'X-API-Version': '1.0'
        },
        body: JSON.stringify({
          soil_metrics: {
            ph: parseFloat(data.ph),
            nitrogen_ppm: parseFloat(data.nitrogen),
            phosphorus_ppm: parseFloat(data.phosphorus),
            potassium_ppm: parseFloat(data.potassium),
            organic_matter_percent: data.organicMatter ? parseFloat(data.organicMatter) : null,
            moisture_percent: data.moisture ? parseFloat(data.moisture) : null
          },
          analysis_type: 'comprehensive',
          location: 'general'
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.warn('API call failed, using enhanced local analysis:', error.message);
      return generateAdvancedRecommendations(data);
    }
  };

  const analyzeData = async () => {
    if (!validateSoilData()) return;

    setLoading(true);
    setError(null);

    try {
      let analysis;
      
      if (inputMethod === 'api') {
        analysis = await callSoilAnalysisAPI(soilData);
      } else {
        await new Promise(resolve => setTimeout(resolve, 1500));
        analysis = generateAdvancedRecommendations(soilData);
      }

      setRecommendations(analysis);
      setActiveTab('recommendations');
    } catch (error) {
      setError(`Analysis failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSoilData({
      ph: '',
      nitrogen: '',
      phosphorus: '',
      potassium: '',
      organicMatter: '',
      moisture: ''
    });
    setRecommendations(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Enhanced Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <Leaf className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">AgriConnect Pro</h1>
              <h2 className="text-xl text-green-600 font-semibold">Advanced Soil Health Analyzer</h2>
            </div>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get comprehensive soil analysis with personalized fertilization schedules, 
            crop recommendations, and seasonal farming tips based on advanced soil science
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Input Section - Spans 2 columns */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center">
                <TestTube2 className="w-5 h-5 mr-2 text-blue-600" />
                Soil Analysis Input
              </h2>
              <button
                onClick={resetForm}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Reset Form
              </button>
            </div>

            {/* Input Method Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Analysis Method</label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setInputMethod('manual')}
                  className={`flex-1 px-4 py-2 rounded-lg transition-all ${
                    inputMethod === 'manual' 
                      ? 'bg-blue-500 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Manual Analysis
                </button>
                {/* <button
                  onClick={() => setInputMethod('api')}
                  className={`flex-1 px-4 py-2 rounded-lg transition-all ${
                    inputMethod === 'api' 
                      ? 'bg-blue-500 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  API Analysis
                </button> */}
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                  <span className="text-red-700">{error}</span>
                </div>
              </div>
            )}

            {/* Enhanced Soil Metrics Input */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <label className="block text-sm font-semibold mb-2 text-blue-900">
                    pH Level <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="3"
                    max="11"
                    value={soilData.ph}
                    onChange={(e) => handleInputChange('ph', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 6.5"
                  />
                  <p className="text-xs text-blue-600 mt-1">Optimal range: 6.0-7.5 for most crops</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <label className="block text-sm font-semibold mb-2 text-green-900">
                    Nitrogen (ppm) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="200"
                    value={soilData.nitrogen}
                    onChange={(e) => handleInputChange('nitrogen', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., 25"
                  />
                  <p className="text-xs text-green-600 mt-1">Target: 20-40 ppm for good growth</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-orange-50 p-4 rounded-lg">
                  <label className="block text-sm font-semibold mb-2 text-orange-900">
                    Phosphorus (ppm) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={soilData.phosphorus}
                    onChange={(e) => handleInputChange('phosphorus', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g., 20"
                  />
                  <p className="text-xs text-orange-600 mt-1">Target: 15-25 ppm</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <label className="block text-sm font-semibold mb-2 text-purple-900">
                    Potassium (ppm) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="500"
                    value={soilData.potassium}
                    onChange={(e) => handleInputChange('potassium', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., 120"
                  />
                  <p className="text-xs text-purple-600 mt-1">Target: 100-150 ppm</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <label className="block text-sm font-semibold mb-2 text-yellow-900">
                    Organic Matter (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="15"
                    value={soilData.organicMatter}
                    onChange={(e) => handleInputChange('organicMatter', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-yellow-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="e.g., 3.5"
                  />
                  <p className="text-xs text-yellow-600 mt-1">Target: 3-5% ideal</p>
                </div>
                <div className="bg-cyan-50 p-4 rounded-lg">
                  <label className="block text-sm font-semibold mb-2 text-cyan-900">
                    Moisture (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={soilData.moisture}
                    onChange={(e) => handleInputChange('moisture', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-cyan-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="e.g., 25"
                  />
                  <p className="text-xs text-cyan-600 mt-1">Field capacity: 20-30%</p>
                </div>
              </div>
            </div>

            <button
              onClick={analyzeData}
              disabled={loading}
              className="w-full mt-6 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 px-6 rounded-lg flex items-center justify-center font-semibold transition-all shadow-lg"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
              ) : (
                <BarChart3 className="w-6 h-6 mr-3" />
              )}
              {loading ? 'Analyzing Soil...' : 'Analyze Soil Health'}
            </button>
          </div>

          {/* Results Section - Spans 3 columns */}
          <div className="lg:col-span-3 bg-white rounded-xl shadow-lg overflow-hidden">
            {!recommendations ? (
              <div className="p-8">
                <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
                <div className="text-center text-gray-500 py-12">
                  <TestTube2 className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">Ready for Analysis</h3>
                  <p className="max-w-md mx-auto">
                    Enter your soil test data and click "Analyze Soil Health" to receive 
                    comprehensive recommendations tailored to your specific soil conditions
                  </p>
                </div>
              </div>
            ) : (
              <div>
                {/* Health Score Header */}
                <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Soil Health Report</h2>
                      <div className="flex items-center">
                        <CheckCircle2 className="w-6 h-6 mr-2" />
                        <span className="text-xl font-semibold">
                          {recommendations.overallHealth} Health
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold">{recommendations.healthScore}/100</div>
                      <div className="text-sm opacity-90">Health Score</div>
                    </div>
                  </div>
                </div>

                {/* Navigation Tabs */}
                <div className="border-b border-gray-200">
                  <nav className="flex space-x-8 px-6">
                    {[
                      { id: 'recommendations', label: 'Recommendations', icon: TrendingUp },
                      { id: 'crops', label: 'Crop Suggestions', icon: Leaf },
                      { id: 'issues', label: 'Soil Issues', icon: AlertTriangle },
                      { id: 'calendar', label: 'Seasonal Tips', icon: Calendar }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                          activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <tab.icon className="w-4 h-4 mr-2" />
                        {tab.label}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {activeTab === 'recommendations' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold mb-4">Fertilization & Treatment Plan</h3>
                      {recommendations.recommendations?.length > 0 ? (
                        recommendations.recommendations.map((rec, index) => (
                          <div key={index} className={`border-l-4 pl-6 py-4 rounded-r-lg ${
                            rec.priority === 'Critical' ? 'border-red-500 bg-red-50' :
                            rec.priority === 'High' ? 'border-orange-500 bg-orange-50' :
                            'border-blue-500 bg-blue-50'
                          }`}>
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold text-lg">{rec.type}</h4>
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                rec.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                                rec.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {rec.priority} Priority
                              </span>
                            </div>
                            <p className="text-gray-700 mb-2">{rec.action}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div><strong>Amount:</strong> {rec.amount}</div>
                              {rec.timeline && <div><strong>Timeline:</strong> {rec.timeline}</div>}
                            </div>
                            {rec.explanation && (
                              <div className="mt-3 p-3 bg-white rounded-md">
                                <div className="flex items-start">
                                  <Info className="w-4 h-4 text-blue-500 mr-2 mt-0.5" />
                                  <p className="text-sm text-gray-600">{rec.explanation}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-green-600">
                          <CheckCircle2 className="w-12 h-12 mx-auto mb-3" />
                          <p className="font-medium">No immediate fertilization needed!</p>
                          <p className="text-sm text-gray-600">Your soil nutrient levels are well-balanced.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'crops' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold mb-4">Recommended Crops for Your Soil</h3>
                      <div className="grid gap-4">
                        {recommendations.cropSuggestions?.map((crop, index) => (
                          <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold text-lg text-green-700">{crop.name || crop}</h4>
                                {crop.reason && (
                                  <p className="text-gray-600 text-sm mt-1">{crop.reason}</p>
                                )}
                              </div>
                              {crop.suitability && (
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  crop.suitability === 'Excellent' ? 'bg-green-100 text-green-800' :
                                  crop.suitability === 'Very Good' ? 'bg-blue-100 text-blue-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {crop.suitability}
                                </span>
                              )}
                            </div>
                          </div>
                        )) || (
                          <div className="text-center py-8 text-gray-500">
                            <Leaf className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p>No specific crop recommendations available</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'issues' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold mb-4">Identified Soil Issues</h3>
                      {recommendations.soilIssues?.length > 0 ? (
                        <div className="space-y-3">
                          {recommendations.soilIssues.map((issue, index) => (
                            <div key={index} className="flex items-start p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                              <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
                              <p className="text-gray-700">{issue}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-green-600">
                          <CheckCircle2 className="w-12 h-12 mx-auto mb-3" />
                          <p className="font-medium">No critical soil issues detected!</p>
                          <p className="text-sm text-gray-600">Your soil appears to be in good condition.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'calendar' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold mb-4">Seasonal Management Tips</h3>
                      {recommendations.seasonalTips?.length > 0 ? (
                        <div className="space-y-3">
                          {recommendations.seasonalTips.map((tip, index) => (
                            <div key={index} className="flex items-start p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                              <Calendar className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                              <p className="text-gray-700">{tip}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-blue-50 rounded-lg p-6">
                          <h4 className="font-medium text-blue-900 mb-3">General Seasonal Guidelines</h4>
                          <div className="space-y-2 text-sm text-blue-800">
                            <p><strong>Spring:</strong> Apply fertilizers 2-4 weeks before planting</p>
                            <p><strong>Summer:</strong> Monitor soil moisture and apply side-dress fertilizers</p>
                            <p><strong>Fall:</strong> Apply lime and organic matter amendments</p>
                            <p><strong>Winter:</strong> Plan next year's soil improvement strategy</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Analysis Footer */}
                <div className="bg-gray-50 px-6 py-4 border-t">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      Analysis Method: {inputMethod === 'api' ? 'External API' : 'Enhanced Local Analysis'}
                    </div>
                    <div>
                      Report Generated: {new Date().toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoilHealthAnalyzer;
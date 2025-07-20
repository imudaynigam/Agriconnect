import React, { useState } from 'react';
import { AlertTriangle, Thermometer, Droplets, Wind, Eye, Bell, MapPin, Search } from 'lucide-react';
import FarmerNavigation from "../../dashboard/Farmer/FarmerNavigation";
import FooterSection from "../../nondashboard/Landing/FooterSection";
const CropDiseaseAlerts = () => {
  const [location, setLocation] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [selectedAlert, setSelectedAlert] = useState(null);

  // Mock location-based alert data
  const locationAlerts = {
    'mumbai': {
      alerts: [
        {
          id: 1,
          type: 'disease',
          severity: 'high',
          title: 'Powdery Mildew Risk',
          description: 'High humidity and warm temperatures in Mumbai create ideal conditions for powdery mildew in crops.',
          location: 'Mumbai Region',
          timestamp: '1 hour ago',
          recommendations: ['Apply sulfur-based fungicide', 'Improve air circulation', 'Reduce leaf wetness']
        },
        {
          id: 2,
          type: 'pest',
          severity: 'medium',
          title: 'Whitefly Infestation',
          description: 'Monsoon conditions in Mumbai favor whitefly population growth.',
          location: 'Mumbai Suburbs',
          timestamp: '3 hours ago',
          recommendations: ['Use yellow sticky traps', 'Apply neem oil spray', 'Monitor regularly']
        }
      ],
      weather: { temp: 28, humidity: 85, wind: 15 }
    },
    'delhi': {
      alerts: [
        {
          id: 1,
          type: 'weather',
          severity: 'high',
          title: 'Heat Stress Warning',
          description: 'Extreme temperatures in Delhi region may cause heat stress in crops.',
          location: 'Delhi NCR',
          timestamp: '30 minutes ago',
          recommendations: ['Increase irrigation frequency', 'Provide shade cloth', 'Early morning watering']
        },
        {
          id: 2,
          type: 'disease',
          severity: 'low',
          title: 'Rust Disease Alert',
          description: 'Dry conditions may lead to rust disease in wheat crops.',
          location: 'Delhi Outskirts',
          timestamp: '2 hours ago',
          recommendations: ['Monitor crop regularly', 'Apply preventive fungicide', 'Maintain proper spacing']
        }
      ],
      weather: { temp: 35, humidity: 45, wind: 8 }
    },
    'bangalore': {
      alerts: [
        {
          id: 1,
          type: 'disease',
          severity: 'medium',
          title: 'Late Blight Risk',
          description: 'Cool and humid conditions in Bangalore favor late blight development.',
          location: 'Bangalore Rural',
          timestamp: '45 minutes ago',
          recommendations: ['Apply copper-based fungicide', 'Improve drainage', 'Remove infected plants']
        }
      ],
      weather: { temp: 22, humidity: 72, wind: 12 }
    },
    'pune': {
      alerts: [
        {
          id: 1,
          type: 'pest',
          severity: 'high',
          title: 'Aphid Outbreak',
          description: 'Weather conditions in Pune are favorable for rapid aphid multiplication.',
          location: 'Pune District',
          timestamp: '20 minutes ago',
          recommendations: ['Release ladybugs', 'Spray insecticidal soap', 'Remove affected leaves']
        },
        {
          id: 2,
          type: 'weather',
          severity: 'medium',
          title: 'Drought Stress',
          description: 'Extended dry period expected in Pune region.',
          location: 'Pune Suburbs',
          timestamp: '1 hour ago',
          recommendations: ['Implement drip irrigation', 'Apply mulch', 'Monitor soil moisture']
        }
      ],
      weather: { temp: 30, humidity: 60, wind: 10 }
    }
  };

  const handleLocationSearch = () => {
    if (!location.trim()) return;
    
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const locationKey = location.toLowerCase().trim();
      const locationData = locationAlerts[locationKey];
      
      if (locationData) {
        setSelectedLocation(location);
        setAlerts(locationData.alerts);
        setWeatherData(locationData.weather);
      } else {
        // Default alerts for unknown locations
        setSelectedLocation(location);
        setAlerts([
          {
            id: 1,
            type: 'weather',
            severity: 'low',
            title: 'No Specific Alerts',
            description: `No specific alerts available for ${location}. General monitoring recommended.`,
            location: location,
            timestamp: 'Just now',
            recommendations: ['Monitor crops regularly', 'Check weather forecasts', 'Follow standard care practices']
          }
        ]);
        setWeatherData({ temp: 25, humidity: 65, wind: 8 });
      }
      setLoading(false);
    }, 1000);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'medium': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'low': return <AlertTriangle className="w-5 h-5 text-blue-600" />;
      default: return <AlertTriangle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'disease': return <Droplets className="w-4 h-4" />;
      case 'pest': return <Eye className="w-4 h-4" />;
      case 'weather': return <Wind className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getAlertCounts = () => {
    return {
      high: alerts.filter(alert => alert.severity === 'high').length,
      medium: alerts.filter(alert => alert.severity === 'medium').length,
      low: alerts.filter(alert => alert.severity === 'low').length,
      total: alerts.length
    };
  };

  const alertCounts = getAlertCounts();

  return (
    <div className="bg-white min-h-screen">
      {/* Navigation Bar */}
      <FarmerNavigation 
        user={{ name: "Farmer User" }}
        onNavigate={(path) => console.log(`Navigate to: ${path}`)}
      />
      
      {/* Main Content - Added pt-24 to account for fixed nav height */}
      <div className="max-w-6xl mx-auto p-6 pt-24">
        {/* Header */}
        <div className="mb-8 pl-3">
          <div className="flex items-center gap-3 mb-2 pl-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <Bell className="w-6 h-6 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Crop Care & Disease Alerts</h1>
          </div>
          <p className="text-gray-600 pl-12 pr-12">
            By understanding local climate patterns, 
            we help farmers stay one step ahead of potential disease outbreaks—offering 
            timely prevention tips and gentle care reminders to protect their crops and 
            their livelihood.
          </p>
        </div>

        {/* Location Search */}
        <div className="mb-8 bg-gray-50 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-800">Select Your Location</h2>
          </div>
          
          <div className="flex gap-3 items-center">
            <div className="flex-1 relative">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter your city (e.g., Mumbai, Delhi, Bangalore, Pune)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleLocationSearch()}
              />
            </div>
            <button
              onClick={handleLocationSearch}
              disabled={loading || !location.trim()}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Search className="w-4 h-4" />
              )}
              {loading ? 'Searching...' : 'Get Alerts'}
            </button>
          </div>
          
          <div className="mt-3 text-sm text-gray-500">
            💡 Try: Mumbai, Delhi, Bangalore, or Pune for demo data
          </div>
        </div>

        {/* Show results only after location is selected */}
        {selectedLocation && (
          <>
            {/* Current Location Display */}
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">Showing alerts for: {selectedLocation}</span>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-600 text-sm font-medium">High Risk</p>
                    <p className="text-2xl font-bold text-red-700">{alertCounts.high}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-600 text-sm font-medium">Medium Risk</p>
                    <p className="text-2xl font-bold text-yellow-700">{alertCounts.medium}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-yellow-500" />
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">Low Risk</p>
                    <p className="text-2xl font-bold text-blue-700">{alertCounts.low}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">Total Alerts</p>
                    <p className="text-2xl font-bold text-green-700">{alertCounts.total}</p>
                  </div>
                  <Bell className="w-8 h-8 text-green-500" />
                </div>
              </div>
            </div>

            {/* Alerts List */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Location-based Alerts</h2>
              
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`border-l-4 rounded-lg p-6 transition-all duration-200 hover:shadow-md cursor-pointer ${getSeverityColor(alert.severity)}`}
                  onClick={() => setSelectedAlert(selectedAlert === alert.id ? null : alert.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="flex items-center gap-2 mt-1">
                        {getSeverityIcon(alert.severity)}
                        {getTypeIcon(alert.type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-800">{alert.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            alert.severity === 'high' ? 'bg-red-100 text-red-700' :
                            alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {alert.severity.toUpperCase()}
                          </span>
                        </div>
                        
                        <p className="text-gray-700 mb-2">{alert.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {alert.location}
                          </span>
                          <span>{alert.timestamp}</span>
                        </div>
                      </div>
                    </div>
                    
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg className={`w-5 h-5 transform transition-transform ${selectedAlert === alert.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Expanded Content */}
                  {selectedAlert === alert.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="font-semibold text-gray-800 mb-2">Recommended Actions:</h4>
                      <ul className="space-y-2">
                        {alert.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-center gap-2 text-gray-700">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            {rec}
                          </li>
                        ))}
                      </ul>
                      
                      <div className="mt-4 flex gap-2">
                        <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                          Mark as Handled
                        </button>
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                          Get More Info
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Weather Conditions */}
            {weatherData && (
              <div className="mt-8 bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Current Conditions in {selectedLocation}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3">
                    <Thermometer className="w-6 h-6 text-orange-500" />
                    <div>
                      <p className="text-sm text-gray-500">Temperature</p>
                      <p className="text-lg font-semibold">{weatherData.temp}°C</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Droplets className="w-6 h-6 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500">Humidity</p>
                      <p className="text-lg font-semibold">{weatherData.humidity}%</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Wind className="w-6 h-6 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Wind Speed</p>
                      <p className="text-lg font-semibold">{weatherData.wind} km/h</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <br></br>
       <FooterSection />
    </div>
  );
};

export default CropDiseaseAlerts;
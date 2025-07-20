import React, { useState } from "react";
import FarmerNavigation from "../../dashboard/Farmer/FarmerNavigation";
import { Thermometer, Droplet, Wind, CloudRain, Bell, Leaf, Sparkles, Sprout, Lightbulb, Sun } from "lucide-react";
import "./HarvestAlert.css"; // Keep your existing styles

export default function HarvestAlertPage() {
  const user = JSON.parse(localStorage.getItem("agri-user")) ?? {
    name: "Farmer",
    email: "farmer@example.com",
  };

  const [alerts] = useState([
    {
      id: 1,
      crop: "Wheat",
      action: "Harvest",
      timing: "2-3 days",
      priority: "high",
      weather: "Sunny, 28°C",
      moisture: "12%",
      recommendation:
        "Ideal conditions for harvesting. Moisture content is perfect.",
    },
    {
      id: 2,
      crop: "Tomatoes",
      action: "Fertilize",
      timing: "1 week",
      priority: "medium",
      weather: "Partly cloudy, 25°C",
      moisture: "18%",
      recommendation:
        "Apply nitrogen-rich fertilizer before expected rain.",
    },
    {
      id: 3,
      crop: "Corn",
      action: "Irrigate",
      timing: "Today",
      priority: "high",
      weather: "Hot, 32°C",
      moisture: "8%",
      recommendation:
        "Immediate irrigation needed due to low soil moisture.",
    },
    {
      id: 4,
      crop: "Soybeans",
      action: "Sow",
      timing: "3-5 days",
      priority: "low",
      weather: "Rain expected, 22°C",
      moisture: "22%",
      recommendation:
        "Wait for soil to dry slightly before sowing.",
    },
  ]);

  const [weatherData] = useState({
    temperature: 28,
    humidity: 65,
    windSpeed: 12,
    rainfall: 2.5,
  });

  const getActionIcon = (action) => {
    switch (action.toLowerCase()) {
      case "harvest":
        return <Leaf className="text-green-600 w-5 h-5" />;
      case "irrigate":
        return <Droplet className="text-blue-500 w-5 h-5" />;
      case "fertilize":
        return <Sparkles className="text-yellow-600 w-5 h-5" />;
      case "sow":
        return <Sprout className="text-lime-600 w-5 h-5" />;
      default:
        return <Bell className="text-gray-500 w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <FarmerNavigation user={user} />

      <div className="pt-24 container mx-auto px-4">
        {/* Weather Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-green-800 flex items-center gap-2">
            <Sun className="w-5 h-5 text-yellow-500" /> Current Weather Conditions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <WeatherCard icon={Thermometer} value={`${weatherData.temperature}°C`} label="Temperature" />
            <WeatherCard icon={Droplet} value={`${weatherData.humidity}%`} label="Humidity" />
            <WeatherCard icon={Wind} value={`${weatherData.windSpeed} km/h`} label="Wind Speed" />
            <WeatherCard icon={CloudRain} value={`${weatherData.rainfall} mm`} label="Rainfall (24h)" />
          </div>
        </section>

        {/* Alert Cards */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-green-800 flex items-center gap-2">
            <Bell className="w-5 h-5 text-red-500" /> Harvest Timing Alerts
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`alert-card priority-${alert.priority} rounded-lg p-4 shadow-md border border-green-100 bg-gradient-to-br from-white to-green-50`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div>{getActionIcon(alert.action)}</div>
                    <div>
                      <h3 className="text-lg font-semibold">{alert.crop}</h3>
                      <p className="text-sm text-gray-600">Action: {alert.action}</p>
                    </div>
                  </div>
                  <div className="px-2 py-1 bg-green-600 text-white text-xs rounded">
                    {alert.timing}
                  </div>
                </div>

                <div className="text-sm space-y-1 mb-3">
                  <DetailRow label="Weather" value={alert.weather} />
                  <DetailRow label="Soil Moisture" value={alert.moisture} />
                </div>

                <div className="bg-green-50 p-3 rounded-lg text-sm">
                  <h4 className="font-medium mb-1 flex items-center gap-1">
                    <Lightbulb className="w-4 h-4 text-yellow-500" /> Recommendation:
                  </h4>
                  <p>{alert.recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Stats */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-green-800 flex items-center gap-2">
            <Bell className="w-5 h-5 text-green-600" /> Farm Overview
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard icon={<Bell className="w-6 h-6 text-red-600" />} value={alerts.filter((a) => a.priority === "high").length} label="Urgent Actions" />
            <StatCard icon={<Leaf className="w-6 h-6 text-green-700" />} value={alerts.length} label="Total Crops" />
            <StatCard icon={<Sparkles className="w-6 h-6 text-yellow-600" />} value={3} label="Completed Today" />
            <StatCard icon={<Sprout className="w-6 h-6 text-lime-700" />} value={7} label="This Week" />
          </div>
        </section>
      </div>
    </div>
  );
}

const WeatherCard = ({ icon: Icon, value, label }) => (
  <div className="bg-white rounded-xl shadow p-5 flex flex-col items-center text-center">
    <Icon className="w-6 h-6 text-green-600 mb-2" />
    <div className="text-xl font-semibold">{value}</div>
    <div className="text-sm text-gray-500">{label}</div>
  </div>
);

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="font-medium text-gray-700">{label}:</span>
    <span className="text-gray-600">{value}</span>
  </div>
);

const StatCard = ({ icon, value, label }) => (
  <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center text-center">
    <div className="mb-2">{icon}</div>
    <div className="text-2xl font-bold">{value}</div>
    <div className="text-sm text-gray-500">{label}</div>
  </div>
);
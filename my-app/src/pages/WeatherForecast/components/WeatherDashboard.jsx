// WeatherDashboard.js
import React, { useEffect, useState } from "react";
import WeatherCard from "./WeatherCard";
import Loader from "./Loader";
import { FiSearch } from "react-icons/fi";

const API_KEY = "8c31947f96ebafebe75cb2cc243a2015";

const WeatherDashboard = () => {
  const [city, setCity] = useState("Delhi");
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tempUnit, setTempUnit] = useState("metric");

  const getAgriTip = (weatherCondition, temp, humidity) => {
    if (weatherCondition.includes("Rain")) {
      return "💧 Rain expected — avoid irrigation.";
    } else if (temp > 35) {
      return "☀️ High temperature — consider mulching to retain soil moisture.";
    } else if (humidity > 80) {
      return "🌾 High humidity — risk of fungal disease, monitor crops.";
    } else if (temp >= 20 && temp <= 30 && humidity < 60) {
      return "✅ Ideal weather — good for fertilization or harvesting.";
    } else {
      return "ℹ️ No special action required.";
    }
  };

  const getFertilizationTip = (temp, humidity) => {
    if (temp >= 22 && temp <= 30 && humidity < 70) {
      return "🌿 Good time for fertilization.";
    } else {
      return "⚠️ Avoid fertilizing now.";
    }
  };

  const getHarvestingTip = (weatherCondition, temp) => {
    if (weatherCondition === "Clear" && temp >= 25) {
      return "🧺 Great weather for harvesting.";
    } else {
      return "🌥️ Wait for clearer skies to harvest.";
    }
  };

  const getMoistureLevel = (weatherCondition, temp) => {
    if (weatherCondition.includes("Rain")) return "Saturated";
    if (temp > 33) return "Dry";
    return "Optimal";
  };

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${tempUnit}`
      );
      const data = await res.json();

      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=${tempUnit}`
      );
      const forecastData = await forecastRes.json();

      setWeather({
        location: data.name,
        temp: data.main.temp,
        condition: data.weather[0].main,
        icon: data.weather[0].icon,
      });

      const daily = forecastData.list.filter(item => item.dt_txt.includes("12:00:00"));
      setForecast(daily);
    } catch (error) {
      console.error("Error fetching weather:", error);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [city, tempUnit]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() !== "") {
      setCity(query.trim());
      setQuery("");
    }
  };

  return (
    <div className="weather-dashboard">
      <form onSubmit={handleSearch} className="search-bar">
        <input
          type="text"
          placeholder="Enter city"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">
          <FiSearch />
        </button>
      </form>

      <div className="unit-toggle">
        <button onClick={() => setTempUnit("metric")} className={tempUnit === "metric" ? "active" : ""}>°C</button>
        <button onClick={() => setTempUnit("imperial")} className={tempUnit === "imperial" ? "active" : ""}>°F</button>
      </div>

      {loading ? (
        <Loader />
      ) : weather ? (
        <>
          <div className="current-weather">
            <h2>{weather.location}</h2>
            <div className="temp">{Math.round(weather.temp)}°{tempUnit === "metric" ? "C" : "F"}</div>
            <div className="desc">{weather.condition}</div>
            <i className={`wi ${getWeatherIconClass(weather.condition)}`} style={{ fontSize: '64px', marginTop: '8px' }}></i>
          </div>
          <div className="forecast-grid">
            {forecast.slice(0, 4).map((item, index) => (
              <WeatherCard
                key={index}
                date={item.dt_txt}
                tempMin={Math.round(item.main.temp_min)}
                tempMax={Math.round(item.main.temp_max)}
                icon={item.weather[0].icon}
                desc={item.weather[0].main}
                unit={tempUnit}
                agriTip={getAgriTip(item.weather[0].main, item.main.temp, item.main.humidity)}
                moistureLevel={getMoistureLevel(item.weather[0].main, item.main.temp)}
                fertTip={getFertilizationTip(item.main.temp, item.main.humidity)}
                harvestTip={getHarvestingTip(item.weather[0].main, item.main.temp)}
              />
            ))}
          </div>
        </>
      ) : (
        <p className="error">City not found.</p>
      )}
    </div>
  );
};

const getWeatherIconClass = (desc) => {
  const iconMap = {
    Clear: "wi-day-sunny",
    Clouds: "wi-cloudy",
    Rain: "wi-rain",
    Drizzle: "wi-showers",
    Thunderstorm: "wi-thunderstorm",
    Snow: "wi-snow",
    Mist: "wi-fog",
    Smoke: "wi-smoke",
    Haze: "wi-day-haze",
    Dust: "wi-dust",
    Fog: "wi-fog",
    Sand: "wi-sandstorm",
    Ash: "wi-volcano",
    Squall: "wi-strong-wind",
    Tornado: "wi-tornado",
  };

  return iconMap[desc] || "wi-na";
};

export default WeatherDashboard;




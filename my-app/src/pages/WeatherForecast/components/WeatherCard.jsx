import React from "react";

const WeatherCard = ({
  date,
  tempMin,
  tempMax,
  icon,
  desc,
  unit,
  agriTip,
  moistureLevel,
  fertTip,
  harvestTip,
}) => {
  const day = new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  // Determine soil moisture class
  const getMoistureClass = (level) => {
    switch (level) {
      case "Dry":
        return "moisture-dry";
      case "Optimal":
        return "moisture-optimal";
      case "Saturated":
        return "moisture-saturated";
      default:
        return "";
    }
  };

  // Convert OpenWeather icon to Weather Icons class
  const getWeatherIconClass = (iconCode) => {
    const map = {
      "01d": "wi-day-sunny",
      "01n": "wi-night-clear",
      "02d": "wi-day-cloudy",
      "02n": "wi-night-alt-cloudy",
      "03d": "wi-cloud",
      "03n": "wi-cloud",
      "04d": "wi-cloudy",
      "04n": "wi-cloudy",
      "09d": "wi-showers",
      "09n": "wi-showers",
      "10d": "wi-day-rain",
      "10n": "wi-night-alt-rain",
      "11d": "wi-thunderstorm",
      "11n": "wi-thunderstorm",
      "13d": "wi-snow",
      "13n": "wi-snow",
      "50d": "wi-fog",
      "50n": "wi-fog",
    };
    return map[iconCode] || "wi-na";
  };

  return (
    <div className="weather-card">
      <div className="weather-day">{day}</div>

      <i
      className={`wi ${getWeatherIconClass(icon)}`}
      style={{ fontSize: "48px", margin: "8px 0", color: "#333" }}
      />

      <div className="temp-range">
        <span className="temp-max">
          {tempMax}°{unit === "metric" ? "C" : "F"}
        </span>
        <span className="temp-min"> / {tempMin}°</span>
      </div>

      <div className="weather-desc">{desc}</div>

      {agriTip && <div className="agri-tip">🌿 {agriTip}</div>}

      {fertTip && <div className="fert-tip">🧪 {fertTip}</div>}

      {harvestTip && <div className="harvest-tip">🧺 {harvestTip}</div>}

      {moistureLevel && (
        <div className={`moisture-level ${getMoistureClass(moistureLevel)}`}>
          💧 Soil Moisture: {moistureLevel}
        </div>
      )}
    </div>
  );
};

export default WeatherCard;




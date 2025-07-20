import React from "react";
import "./WeatherForecast.css"; // ✅ scoped CSS

import Header from "./components/Header";
import Footer from "./components/Footer";
import WeatherDashboard from "./components/WeatherDashboard";
import 'weather-icons/css/weather-icons.css';

export default function WeatherForecast() {
  return (
    <div className="weather-forecast-page">
      <Header />

      {/* ✅ Add push-down spacing to prevent overlap */}
      <main className="main-content" style={{ paddingTop: "80px" }}>
        <WeatherDashboard />
      </main>

      <Footer />
    </div>
  );
}
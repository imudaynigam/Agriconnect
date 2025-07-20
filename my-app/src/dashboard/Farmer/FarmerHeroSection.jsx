import React from "react";
import { useNavigate } from 'react-router-dom';
import FarmerNavigation from "./FarmerNavigation";
import AnimationBackgroundElement from "../../nondashboard/Landing/AnimationBackgroundElement";

const FarmerHeroSection = ({ user }) => {
  const navigate = useNavigate();
  return (
    <>
      <FarmerNavigation user={user} />
      <section className="farmer-hero-section" style={{ position: 'relative', overflow: 'hidden' }}>
        <AnimationBackgroundElement />
        <div className="farmer-overlay" style={{ position: 'absolute', inset: 0, zIndex: 1 }} />
        <div className="farmer-content" style={{ position: 'relative', zIndex: 2 }}>
          <h1 className="farmer-title">
            Welcome, {user?.name || "Farmer"}!
            <span className="farmer-subtitle">Here’s Your Smart Farming Dashboard</span>
          </h1>

          <p className="farmer-description" style={{ color: 'black' }}>
            From soil health tracking to crop price forecasts — empower your land with smart tools.
          </p>

        <button 
          className="farmer-cta" 
          onClick={() => navigate("/Farmer/new-farmer-dashboard")}
          >
          Explore Now
        </button>
        </div>
      </section>
    </>
  );
};

export default FarmerHeroSection;
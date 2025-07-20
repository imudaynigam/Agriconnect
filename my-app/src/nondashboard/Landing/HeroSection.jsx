"use client";
import React from "react";
import AnimationBackgroundElement from "./AnimationBackgroundElement";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section id="home" className="min-h-screen flex flex-col items-center justify-center pt-20 px-6 relative bg-white">
      <AnimationBackgroundElement />
      <div className="max-w-4xl mx-auto text-center z-10">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
          Bridging Agriculture,<br />
          <span className="text-green-600">Investment & Commerce</span>
        </h1>
        <p className="text-lg md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          Empowering lives through real-time insights, safe and transparent investments, and a direct path from farm to market — all in one trusted place.
        </p>
        <button
          className="bg-green-600 text-white px-8 py-4 rounded-full hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-xl text-lg font-semibold"
          onClick={() => navigate('/login')}
        >
          Get Started
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
import React from "react";
import farmerImg from "../../assets/farmer.jpg";
import AnimationBackgroundElement from "../../nondashboard/Landing/AnimationBackgroundElement";

const InvestorHeroSection = () => {
  return (
    <section id="home" className="min-h-screen flex flex-col md:flex-row items-center justify-center pt-20 px-6 relative bg-white">
      <AnimationBackgroundElement />
      <div className="flex-1 flex justify-center items-center mb-8 md:mb-0 z-10">
        <img
          src={farmerImg}
          alt="Farmer working in field"
          className="w-full max-w-xs md:max-w-md rounded-2xl shadow-lg object-cover animate-float-photo"
        />
      </div>
      <div className="flex-1 max-w-2xl mx-auto text-center md:text-left z-10">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
          Empowering <span className="text-green-600 block">Farmers & Investors</span>
        </h1>
        <p className="text-lg md:text-2xl text-gray-600 mb-8 max-w-3xl leading-relaxed">
          Join AgriConnect to support farmers, invest in sustainable agriculture, and grow your wealth while nurturing the future of farming. Real-time insights, secure investments, and a direct path from farm to market — all in one trusted place.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start items-center">
          <button className="bg-green-600 text-white px-8 py-4 rounded-full hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center text-lg font-semibold">
            Get Started
          </button>
        </div>
      </div>
      <style>{`
        .animate-float-photo {
          animation: floatPhoto 3.5s ease-in-out infinite;
        }
        @keyframes floatPhoto {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-18px); }
        }
      `}</style>
    </section>
  );
};

export default InvestorHeroSection; 